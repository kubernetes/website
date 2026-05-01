---
layout: blog
title: "Kubernetes v1.36: Deprecation and removal of Service ExternalIPs"
draft: true # will be changed to date: YYYY-MM-DD before publication
slug: kubernetes-v1-36-deprecation-and-removal-of-service-externalips # optional
author: >
  Adrian Moisey (independent),
  Dan Winship (Red Hat),
---

The `.spec.externalIPs` field for [Service](/docs/concepts/services-networking/service/) was an early attempt to provide
cloud-load-balancer-like functionality for non-cloud clusters.
Unfortunately, the API assumes that every user in the cluster is fully
trusted, and in any situation where that is not the case, it enables
various security exploits, as described in
[CVE-2020-8554](https://www.cvedetails.com/cve/CVE-2020-8554/).

Since Kubernetes 1.21, the Kubernetes project has recommended that all users disable
`.spec.externalIPs`. To make that easier, Kubernetes also added an admission controller
(`DenyServiceExternalIPs`) that can be enabled to do this. At the time,
SIG Network felt that blocking the functionality by default was too large a
breaking change to consider.

However, the security problems are still there, and as a project we're increasingly
unhappy with the "insecure by default" state of the feature.
Additionally, there are now several better alternatives for non-cloud
clusters wanting load-balancer-like functionality.

As a result, the `.spec.externalIPs` field for Service is now formally deprecated in Kubernetes 1.36.
We expect that a future minor release of Kubernetes will drop
implementation of the behavior from `kube-proxy`, and will update the
Kubernetes [conformance](https://www.cncf.io/training/certification/software-conformance/) criteria to require that conforming implementations
**do not** provide support.

## A note on terminology, and what hasn't been deprecated {#terminology}

The phrase _external IP_ is somewhat overloaded in Kubernetes:

  - The Service API has a field `.spec.externalIPs` that can be used
    to add additional IP addresses that a Service will respond on.

  - The Node API's `.status.addresses` field can list addresses of
    several different types, one of which is called `ExternalIP`.

  - The `kubectl` tool, when displaying information about a Service of type
    LoadBalancer in the default output format, will show the load
    balancer IP address under the column heading `EXTERNAL-IP`.

This deprecation is about the first of those. If you are not setting
the field `externalIPs` in any of your Services, then it does not
apply to you.

That said, as a precaution, you may still want to enable the [DenyServiceExternalIPs](/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips) admission controller to
block any future use of the `externalIPs` field.

## Alternatives to `externalIPs` {#alternatives}

If you are using `.spec.externalIPs`, then there are several alternatives.

Consider a Service like the following:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-example-service
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: my-example-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  externalIPs:
    - "192.0.2.4"
```

### Using manually-managed LoadBalancer Services instead of `externalIPs` {#alternative-LoadBalancer}

The easiest (but also worst) option is to just switch from using
`externalIPs` to using a `type: LoadBalancer` service, and assigning a
load balancer IP by hand. This is, essentially, exactly the same as
`externalIPs`, with one important difference: the load balancer IP is
part of the Service's `.status`, not its `.spec`, and in a cluster
with RBAC enabled, it can't be edited by ordinary users by default.
Thus, this replacement for `externalIPs` would only be available to
users who were given permission by the admins (although those users
would then be fully empowered to replicate CVE-2020-8554; there would
still not be any further checks to ensure that one user wasn't
stealing another user's IPs, etc.)

Because of the way that `.status` works in Kubernetes, you must create the
Service without a load balancer IP, and then add the IP as a second step:

```console
$ cat loadbalancer-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-example-service
spec:
  # prevent any real load balancer controllers from managing this service
  # by using a non-existent loadBalancerClass
  loadBalancerClass: non-existent-class
  type: LoadBalancer
  selector:
    app.kubernetes.io/name: my-example-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
$ kubectl apply -f loadbalancer-service.yaml
service/my-example-service created
$ kubectl patch service my-example-service --subresource=status --type=merge -p '{"status":{"loadBalancer":{"ingress":[{"ip":"192.0.2.4"}]}}}'
```

### Using a non-cloud based load balancer controller {#alternative-load-balancer-controller}

Although `LoadBalancer` services were originally designed to be backed by
cloud load balancers, Kubernetes can also support them on non-cloud platforms
by using a third-party load balancer controller such as [MetalLB](https://metallb.io/).
This solves the security problems associated with `externalIPs` because the
administrator can configure what ranges of IP addresses the controller will assign
to services, and the controller will ensure that two services can't both use the same
IP.

So, for example, after [installing](https://metallb.io/installation/) and
[configuring](https://metallb.io/configuration/) MetalLB, a cluster administrator
could configure a pool of IP addresses for use in the cluster:

```yaml
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: production
  namespace: metallb-system
spec:
  addresses:
  - 192.0.2.0/24
  autoAssign: true
  avoidBuggyIPs: false
```

After which a user can create a `type: LoadBalancer` Service and MetalLB will handle the
assignment of the IP address. MetalLB even supports the deprecated `loadBalancerIP`
field in Service, so the end user can request a specific IP (assuming it is available)
for backward-compatibility with the `externalIPs` approach, rather than being
assigned one at random:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-example-service
spec:
  type: LoadBalancer
  selector:
    app.kubernetes.io/name: my-example-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  loadBalancerIP: "192.0.2.4"
```

Similar approaches would work with other load balancer controllers.
This approach can allow cluster administrators to have control over which IP addresses are assigned,
rather than users.

### Using Gateway API {#alternative-gateway-api}

Another potential solution is to use an implementation of the
[Gateway API](https://gateway-api.sigs.k8s.io/).

Gateway API allows cluster administrators to define a Gateway resource, which can have an IP address
attached to it via the `.spec.addresses` field. Since Gateway resources are designed to be managed by
[cluster administrators](https://gateway-api.sigs.k8s.io/concepts/security/), RBAC rules can be put in place to only allow privileged users to manage them.

An example of how this could look is:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: example-gateway-class
  addresses:
  - type: IPAddress
    value: "192.0.2.4"
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: example-route
spec:
  parentRefs:
  - name: example-gateway
  rules:
  - backendRefs:
    - name: example-svc
      port: 80
---
apiVersion: v1
kind: Service
metadata:
  name: example-svc
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: example-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

The Gateway API project is the next generation of Kubernetes Ingress, Load Balancing, and Service Mesh APIs within Kubernetes.
Gateway API was designed to fix the shortcomings of the Service and Ingress resource, making it a very reliable robust solution
that is under active development.

## Timeline for `externalIPs` deprecation

The rough timeline for this deprecation is as follows:

1. With the release of Kubernetes 1.36, the field was deprecated;
   Kubernetes now emits [warnings](/blog/2020/09/03/warnings/) when a user uses this field
2. About a year later (v1.40 at the earliest) support for `.spec.externalIPs` will be disabled in kube-proxy, but users will have a way to opt back in should they require more time to migrate away
3. About another year later - (v1.43 at the earliest) support will be disabled completely; users won't have a way to opt back in
