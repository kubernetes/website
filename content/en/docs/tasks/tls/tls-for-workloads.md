---
title: Set Up TLS for a Workload
content_type: task
weight: 60
---

<!-- overview -->

Transport Layer Security (TLS) encrypts traffic between clients and your
workload, and between services inside a cluster. Without TLS, data travels in
plaintext and any party that can observe the network can read or tamper with it.

This page explains four approaches for enabling TLS on a Kubernetes workload:

- _TLS in the container_ — your application terminates TLS directly
- _TLS at the Service layer_ — a cloud LoadBalancer handles TLS on behalf of your Pods
- _TLS via Ingress_ — an Ingress controller terminates TLS before traffic reaches your Pods
- _TLS via Gateway API_ — a Gateway resource terminates TLS with more expressive routing rules

Each approach stores the certificate and private key in a
{{< glossary_tooltip text="Secret" term_id="secret" >}} and then uses that
Secret in a different place. Read through all four, then pick the one that
matches how your cluster and application are structured.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

You need a TLS certificate and its matching private key. For production use,
obtain a certificate from a trusted Certificate Authority (CA). For
local testing, you can generate a self-signed certificate with `openssl`:

```shell
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout tls.key \
  -out tls.crt \
  -subj "/CN=my-app.example.com/O=my-app"
```

This produces two files:

- `tls.crt` — the certificate (public)
- `tls.key` — the private key (keep this secret)

{{< warning >}}
Never commit `tls.key` to version control or include it in a container image.
Store it only in a Kubernetes Secret.
{{< /warning >}}

<!-- steps -->

## Step 1: Store the certificate in a Secret {#create-the-secret}

All four approaches start here. Kubernetes stores the certificate and key
together in a TLS Secret so that other objects (Pods, Ingress, Gateway) can
reference it without embedding the raw bytes in their own manifests.

Create the Secret from the two files you generated above:

```shell
kubectl create secret tls my-tls-secret \
  --cert=tls.crt \
  --key=tls.key
```

Verify it was created:

```shell
kubectl get secret my-tls-secret
```

The output is similar to:

```none
NAME            TYPE                DATA   AGE
my-tls-secret   kubernetes.io/tls   2      5s
```

A `kubernetes.io/tls` Secret always has exactly two data keys:

| Key       | Contents                               |
|-----------|----------------------------------------|
| `tls.crt` | PEM-encoded certificate (or chain)     |
| `tls.key` | PEM-encoded private key                |

{{< note >}}
If your CA issued an intermediate certificate as well, concatenate it with
your server certificate before creating the Secret:
`cat server.crt intermediate.crt > tls.crt`

Clients validate the full chain, so the order matters: server certificate first,
then intermediates toward the root.
{{< /note >}}

With the Secret in place, choose the approach that fits your workload.

---

## Approach A: TLS in the container {#tls-in-the-container}

In this approach your application code or server process (nginx, Envoy, your
Go/Java/Python binary) reads the certificate and key directly and terminates
TLS itself. This works for any workload type and does not require an Ingress
controller or a cloud provider.

### Mount the Secret into the Pod

The Secret's two files become files on disk inside the container. Add a
`volume` that references the Secret and a `volumeMount` that places the files
into the path your server expects:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: nginx:stable
          ports:
            - containerPort: 443
          volumeMounts:
            - name: tls-certs
              mountPath: /etc/tls
              readOnly: true
      volumes:
        - name: tls-certs
          secret:
            secretName: my-tls-secret
```

After the Pod starts, `/etc/tls/tls.crt` and `/etc/tls/tls.key` are available
inside the container.

### Configure the server to use the mounted files

How you point your server at those files depends on the server. For nginx,
update `nginx.conf` to reference the mount path:

```nginx
server {
    listen 443 ssl;
    ssl_certificate     /etc/tls/tls.crt;
    ssl_certificate_key /etc/tls/tls.key;

    location / {
        proxy_pass http://localhost:8080;
    }
}
```

For a Go `net/http` server:

```go
http.ListenAndServeTLS(":443", "/etc/tls/tls.crt", "/etc/tls/tls.key", handler)
```

### Expose the Pod over a Service

Create a Service that forwards port 443 to the container port:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app
spec:
  selector:
    app: my-app
  ports:
    - port: 443
      targetPort: 443
```

Traffic is encrypted end-to-end: from the client all the way into the
container. Nothing in the cluster can inspect it in plaintext.

{{< note >}}
If Kubernetes rotates a Secret (for example, because you updated it with a
new certificate), the mounted files are updated automatically — but your server
process must reload them. Either configure your server for dynamic reload or
add a sidecar that sends `SIGHUP` after detecting a file change.
{{< /note >}}

---

## Approach B: TLS at the Service layer (cloud LoadBalancer) {#tls-at-the-service-layer}

Cloud providers (AWS, GCP, Azure, and others) support TLS termination directly
on a load balancer. You annotate a LoadBalancer Service with the cloud
provider's annotation that names the certificate to use. The load balancer
terminates TLS before forwarding plain HTTP to your Pods. Your application
code does not need to handle TLS at all.

### How it works

```
Client ──(TLS)──▶ Cloud Load Balancer ──(plain HTTP)──▶ Service ──▶ Pod
```

The certificate lives in your cloud provider's certificate store (AWS ACM,
GCP Certificate Manager, Azure Key Vault), not in a Kubernetes Secret. The
annotation tells the load balancer which certificate to present.

### AWS example (using ACM)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "arn:aws:acm:us-east-1:123456789012:certificate/abc-123"
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: "http"
    service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443"
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
    - port: 443
      targetPort: 8080
```

Replace the ARN with the ARN of your ACM certificate.

### GCP example (using a Google-managed certificate)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app
  annotations:
    networking.gke.io/managed-certificates: "my-managed-cert"
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
    - port: 443
      targetPort: 8080
```

You also need to create the ManagedCertificate resource (a GKE-specific CRD)
that names the domain for which GCP provisions and rotates the certificate
automatically.

### Azure example (using Azure Application Gateway)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-health-probe-request-path: "/healthz"
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
    - port: 443
      targetPort: 8080
```

On AKS, the Application Gateway Ingress Controller (AGIC) is typically used
instead of raw Service annotations for TLS. See Approach C or your cloud
provider's documentation for the recommended pattern.

{{< note >}}
Traffic between the load balancer and your Pods travels inside the cluster
network in plaintext with this approach. If your security requirements demand
encryption all the way to the Pod, use Approach A instead (or combine A and B
so that the LB re-encrypts to the backend).
{{< /note >}}

---

## Approach C: TLS via Ingress {#tls-via-ingress}

An {{< glossary_tooltip text="Ingress" term_id="ingress" >}} resource sits in
front of multiple Services and terminates TLS at the cluster edge. You
reference the TLS Secret in the Ingress manifest. The Ingress controller reads
the Secret and configures the underlying proxy (nginx, Traefik, HAProxy, and
so on) to present that certificate for the hostname you name.

### How it works

```
Client ──(TLS)──▶ Ingress Controller ──(plain HTTP)──▶ Service ──▶ Pod
                        │
                reads Secret my-tls-secret
```

### Create the Ingress with a TLS stanza

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app
spec:
  tls:
    - hosts:
        - my-app.example.com
      secretName: my-tls-secret
  rules:
    - host: my-app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-app
                port:
                  number: 80
```

The `tls` stanza does two things:

1. _Binds the hostname to the Secret_ — the controller presents
   `my-tls-secret` when a client connects to `my-app.example.com`.
2. _Enforces SNI routing_ — if your controller handles multiple hostnames,
   it uses Server Name Indication (SNI) to select the right certificate for
   each hostname without needing a separate IP address per domain.

### Redirect HTTP to HTTPS

Most Ingress controllers support a redirect annotation. For the nginx Ingress
controller:

```yaml
metadata:
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
```

Add this annotation to the Ingress manifest above. The controller responds
to plain HTTP requests on port 80 with a `301 Moved Permanently`
redirect to the HTTPS URL.

### Multiple hostnames, multiple certificates

You can list several `tls` entries, each naming a different hostname and
Secret:

```yaml
spec:
  tls:
    - hosts:
        - api.example.com
      secretName: api-tls-secret
    - hosts:
        - dashboard.example.com
      secretName: dashboard-tls-secret
  rules:
    - host: api.example.com
      ...
    - host: dashboard.example.com
      ...
```

Each Secret must contain a certificate valid for the hostname it covers.

{{< note >}}
Ingress is cluster-scoped in terms of behavior but namespace-scoped as an
object. The Secret named in `spec.tls[].secretName` must be in the **same
namespace** as the Ingress object. If you need to share a certificate across
namespaces, copy the Secret into each namespace, or use a tool like
[External Secrets Operator](https://external-secrets.io) to keep copies in
sync.
{{< /note >}}

---

## Approach D: TLS via Gateway API {#tls-via-gateway-api}

The "Gateway API" term_id="gateway-api"is a newer set of Kubernetes APIs
(in the `gateway.networking.k8s.io` group) that provides more expressive 
routing than Ingress. It separates infrastructureconcerns (the Gateway object,
managed by a cluster operator) from application routing concerns 
(the HTTPRoute object, managed by the application team).

{{< note >}}
Gateway API is available as a set of CRDs. Install them before creating any
Gateway or HTTPRoute objects:

```shell
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/latest/download/standard-install.yaml
```

You also need a Gateway controller installed in your cluster (for example,
Envoy Gateway, NGINX Gateway Fabric, or Istio). Refer to your controller's
installation guide.
{{< /note >}}

### How it works

```
Client ──(TLS)──▶ Gateway ──(plain HTTP or re-encrypted)──▶ HTTPRoute ──▶ Service ──▶ Pod
                     │
              reads Secret my-tls-secret
```

The Gateway object is analogous to the Ingress controller listener. The HTTPRoute is 
analogous to the Ingress rules.

### Create a Gateway with a TLS listener

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: my-gateway
  namespace: infra
spec:
  gatewayClassName: eg          # name of your installed GatewayClass
  listeners:
    - name: https
      protocol: HTTPS
      port: 443
      tls:
        mode: Terminate
        certificateRefs:
          - name: my-tls-secret
            namespace: infra
      allowedRoutes:
        namespaces:
          from: All
```

`tls.mode: Terminate` tells the Gateway to decrypt TLS and forward plain HTTP
to the backend. Set it to `Passthrough` if you want TLS to pass through to the
Pod unmodified (as in Approach A), in which case you do not supply a
`certificateRefs`.

### Create an HTTPRoute to send traffic to your Service

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: my-app
  namespace: default
spec:
  parentRefs:
    - name: my-gateway
      namespace: infra
  hostnames:
    - "my-app.example.com"
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /
      backendRefs:
        - name: my-app
          port: 80
```

`parentRefs` binds this route to the Gateway. The Gateway's `allowedRoutes.namespaces.from: All` 
setting above permits routes from any namespace to attach.

### Cross-namespace Secret references

Unlike Ingress, Gateway API supports referencing a Secret in a different
namespace using a ReferenceGrant. The cluster operator creates a
ReferenceGrant in the namespace that owns the Secret, explicitly allowing
the Gateway's namespace to read it:

```yaml
apiVersion: gateway.networking.k8s.io/v1beta1
kind: ReferenceGrant
metadata:
  name: allow-infra-to-read-tls
  namespace: certs           # namespace where the Secret lives
spec:
  from:
    - group: gateway.networking.k8s.io
      kind: Gateway
      namespace: infra       # namespace where the Gateway lives
  to:
    - group: ""
      kind: Secret
```

This avoids duplicating Secrets across namespaces for multi-tenant clusters.

---

## Automate certificate issuance and renewal {#automate-with-cert-manager}

Obtaining, renewing, and rotating certificates manually is error-prone.
[cert-manager](https://cert-manager.io) is a Kubernetes controller that
automates this lifecycle. It integrates with:

- _Let's Encrypt_ (free, publicly trusted certificates via ACME)
- _Vault_ (enterprise PKI)
- _Venafi_ (enterprise PKI)
- _Self-signed_ issuers (for internal services)

### Install cert-manager

```shell
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml
```

### Create a Let's Encrypt Issuer

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: you@example.com
    privateKeySecretRef:
      name: letsencrypt-prod-account-key
    solvers:
      - http01:
          ingress:
            ingressClassName: nginx
```

### Annotate your Ingress to request a certificate automatically

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
    - hosts:
        - my-app.example.com
      secretName: my-app-tls-cert   # cert-manager creates and populates this Secret
  rules:
    - host: my-app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-app
                port:
                  number: 80
```

When you apply this Ingress, cert-manager detects the annotation, contacts Let's Encrypt, 
completes an HTTP-01 challenge to prove domain ownership, and stores the resulting certificate
in `my-app-tls-cert`. It renews the certificate automatically before it expires.  
Cert-manager also integrates with Gateway API using Gateway annotations or Certificate objects
that target a Gateway listener directly.

---

## Choosing an approach {#choosing-an-approach}

| Situation | Recommended approach |
|-----------|----------------------|
| You control the application code and need end-to-end encryption (nothing decrypts in the cluster) | A — TLS in the container |
| You are on a managed cloud and want to offload certificate management to the provider | B — Cloud LoadBalancer |
| You run multiple HTTP/HTTPS services behind one IP address and want path- or host-based routing | C — Ingress |
| You need cross-namespace routing, TCP/gRPC routing, or clearer separation between infra and app teams | D — Gateway API |
| You want automated certificate issuance and renewal from Let's Encrypt or an internal CA | Any approach + cert-manager |

## {{% heading "whatsnext" %}}

- Learn about the `certificates.k8s.io` API for issuing certificates signed by
  your cluster's CA: [Manage TLS Certificates in a Cluster](/docs/tasks/tls/managing-tls-in-a-cluster/)
- Read the [Ingress](/docs/concepts/services-networking/ingress/) concept page
  for a full description of Ingress rules and backend types
- Explore the [Gateway API](https://gateway-api.sigs.k8s.io/) specification
  for advanced traffic management patterns including traffic splitting and header-based routing
- Read [cert-manager documentation](https://cert-manager.io/docs/) for
  automated certificate management in Kubernetes
