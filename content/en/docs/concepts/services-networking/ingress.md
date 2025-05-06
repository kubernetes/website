---
reviewers:
- bprashanth
title: Ingress
api_metadata:
- apiVersion: "networking.k8s.io/v1"
  kind: "Ingress"
- apiVersion: "networking.k8s.io/v1"
  kind: "IngressClass"
content_type: concept
description: >-
  Make your HTTP (or HTTPS) network service available using a protocol-aware configuration
  mechanism, that understands web concepts like URIs, hostnames, paths, and more.
  The Ingress concept lets you map traffic to different backends based on rules you define
  via the Kubernetes API.
weight: 30
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.19" state="stable" >}}
{{< glossary_definition term_id="ingress" length="all" >}}

{{< note >}}
Ingress is frozen. New features are being added to the [Gateway API](/docs/concepts/services-networking/gateway/).
{{< /note >}}

<!-- body -->

## Terminology

For clarity, this guide defines the following terms:

* Node: A worker machine in Kubernetes, part of a cluster.
* Cluster: A set of Nodes that run containerized applications managed by Kubernetes.
  For this example, and in most common Kubernetes deployments, nodes in the cluster
  are not part of the public internet.
* Edge router: A router that enforces the firewall policy for your cluster. This
  could be a gateway managed by a cloud provider or a physical piece of hardware.
* Cluster network: A set of links, logical or physical, that facilitate communication
  within a cluster according to the Kubernetes [networking model](/docs/concepts/cluster-administration/networking/).
* Service: A Kubernetes {{< glossary_tooltip term_id="service" >}} that identifies
  a set of Pods using {{< glossary_tooltip text="label" term_id="label" >}} selectors.
  Unless mentioned otherwise, Services are assumed to have virtual IPs only routable within the cluster network.

## What is Ingress?

[Ingress](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1-networking-k8s-io)
exposes HTTP and HTTPS routes from outside the cluster to
{{< link text="services" url="/docs/concepts/services-networking/service/" >}} within the cluster.
Traffic routing is controlled by rules defined on the Ingress resource.

Here is a simple example where an Ingress sends all its traffic to one Service:

{{< figure src="/docs/images/ingress.svg" alt="ingress-diagram" class="diagram-large" caption="Figure. Ingress" link="https://mermaid.live/edit#pako:eNqNkstuwyAQRX8F4U0r2VHqPlSRKqt0UamLqlnaWWAYJygYLB59KMm_Fxcix-qmGwbuXA7DwAEzzQETXKutof0Ovb4vaoUQkwKUu6pi3FwXM_QSHGBt0VFFt8DRU2OWSGrKUUMlVQwMmhVLEV1Vcm9-aUksiuXRaO_CEhkv4WjBfAgG1TrGaLa-iaUw6a0DcwGI-WgOsF7zm-pN881fvRx1UDzeiFq7ghb1kgqFWiElyTjnuXVG74FkbdumefEpuNuRu_4rZ1pqQ7L5fL6YQPaPNiFuywcG9_-ihNyUkm6YSONWkjVNM8WUIyaeOJLO3clTB_KhL8NQDmVe-OJjxgZM5FhFiiFTK5zjDkxHBQ9_4zB4a-x20EGNSZhyaKmXrg7f5hSsvufUwTMXThtMWiot5Jh6p9ffimHijIezaSVoeN0uiqcfMJvf7w" >}}

An Ingress may be configured to give Services externally-reachable URLs,
load balance traffic, terminate SSL / TLS, and offer name-based virtual hosting.
An [Ingress controller](/docs/concepts/services-networking/ingress-controllers)
is responsible for fulfilling the Ingress, usually with a load balancer, though
it may also configure your edge router or additional frontends to help handle the traffic.

An Ingress does not expose arbitrary ports or protocols. Exposing services other than HTTP and HTTPS to the internet typically
uses a service of type [Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport) or
[Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer).

## Prerequisites

You must have an [Ingress controller](/docs/concepts/services-networking/ingress-controllers)
to satisfy an Ingress. Only creating an Ingress resource has no effect.

You may need to deploy an Ingress controller such as [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/).
You can choose from a number of [Ingress controllers](/docs/concepts/services-networking/ingress-controllers).

Ideally, all Ingress controllers should fit the reference specification. In reality, the various Ingress
controllers operate slightly differently.

{{< note >}}
Make sure you review your Ingress controller's documentation to understand the caveats of choosing it.
{{< /note >}}

## The Ingress resource

A minimal Ingress resource example:

{{% code_sample file="service/networking/minimal-ingress.yaml" %}}

An Ingress needs `apiVersion`, `kind`, `metadata` and `spec` fields.
The name of an Ingress object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
For general information about working with config files, see
[deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/),
[configuring containers](/docs/tasks/configure-pod-container/configure-pod-configmap/),
[managing resources](/docs/concepts/workloads/management/).
Ingress frequently uses annotations to configure some options depending on the Ingress controller, an example of which
is the [rewrite-target annotation](https://github.com/kubernetes/ingress-nginx/blob/main/docs/examples/rewrite/README.md).
Different [Ingress controllers](/docs/concepts/services-networking/ingress-controllers) support different annotations.
Review the documentation for your choice of Ingress controller to learn which annotations are supported.

The [Ingress spec](/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)
has all the information needed to configure a load balancer or proxy server. Most importantly, it
contains a list of rules matched against all incoming requests. Ingress resource only supports rules
for directing HTTP(S) traffic.

If the `ingressClassName` is omitted, a [default Ingress class](#default-ingress-class)
should be defined.

There are some ingress controllers, that work without the definition of a
default `IngressClass`. For example, the Ingress-NGINX controller can be
configured with a [flag](https://kubernetes.github.io/ingress-nginx/user-guide/k8s-122-migration/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class`. It is [recommended](https://kubernetes.github.io/ingress-nginx/user-guide/k8s-122-migration/#i-have-only-one-ingress-controller-in-my-cluster-what-should-i-do) though, to specify the
default `IngressClass` as shown [below](#default-ingress-class).

### Ingress rules

Each HTTP rule contains the following information:

* An optional host. In this example, no host is specified, so the rule applies to all inbound
  HTTP traffic through the IP address specified. If a host is provided (for example,
  foo.bar.com), the rules apply to that host.
* A list of paths (for example, `/testpath`), each of which has an associated
  backend defined with a `service.name` and a `service.port.name` or
  `service.port.number`. Both the host and path must match the content of an
  incoming request before the load balancer directs traffic to the referenced
  Service.
* A backend is a combination of Service and port names as described in the
  [Service doc](/docs/concepts/services-networking/service/) or a [custom resource backend](#resource-backend)
  by way of a {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRD" >}}. HTTP (and HTTPS) requests to the
  Ingress that match the host and path of the rule are sent to the listed backend.

A `defaultBackend` is often configured in an Ingress controller to service any requests that do not
match a path in the spec.

### DefaultBackend {#default-backend}

An Ingress with no rules sends all traffic to a single default backend and `.spec.defaultBackend`
is the backend that should handle requests in that case.
The `defaultBackend` is conventionally a configuration option of the
[Ingress controller](/docs/concepts/services-networking/ingress-controllers) and
is not specified in your Ingress resources.
If no `.spec.rules` are specified, `.spec.defaultBackend` must be specified.
If `defaultBackend` is not set, the handling of requests that do not match any of the rules will be up to the
ingress controller (consult the documentation for your ingress controller to find out how it handles this case).

If none of the hosts or paths match the HTTP request in the Ingress objects, the traffic is
routed to your default backend.

### Resource backends {#resource-backend}

A `Resource` backend is an ObjectRef to another Kubernetes resource within the
same namespace as the Ingress object. A `Resource` is a mutually exclusive
setting with Service, and will fail validation if both are specified. A common
usage for a `Resource` backend is to ingress data to an object storage backend
with static assets.

{{% code_sample file="service/networking/ingress-resource-backend.yaml" %}}

After creating the Ingress above, you can view it with the following command:

```bash
kubectl describe ingress ingress-resource-backend
```

```
Name:             ingress-resource-backend
Namespace:        default
Address:
Default backend:  APIGroup: k8s.example.com, Kind: StorageBucket, Name: static-assets
Rules:
  Host        Path  Backends
  ----        ----  --------
  *
              /icons   APIGroup: k8s.example.com, Kind: StorageBucket, Name: icon-assets
Annotations:  <none>
Events:       <none>
```

### Path types

Each path in an Ingress is required to have a corresponding path type. Paths
that do not include an explicit `pathType` will fail validation. There are three
supported path types:

* `ImplementationSpecific`: With this path type, matching is up to the
  IngressClass. Implementations can treat this as a separate `pathType` or treat
  it identically to `Prefix` or `Exact` path types.

* `Exact`: Matches the URL path exactly and with case sensitivity.

* `Prefix`: Matches based on a URL path prefix split by `/`. Matching is case
  sensitive and done on a path element by element basis. A path element refers
  to the list of labels in the path split by the `/` separator. A request is a
  match for path _p_ if every _p_ is an element-wise prefix of _p_ of the
  request path.

  {{< note >}}
  If the last element of the path is a substring of the last
  element in request path, it is not a match (for example: `/foo/bar`
  matches `/foo/bar/baz`, but does not match `/foo/barbaz`).
  {{< /note >}}

### Examples

| Kind   | Path(s)                         | Request path(s)               | Matches?                           |
|--------|---------------------------------|-------------------------------|------------------------------------|
| Prefix | `/`                             | (all paths)                   | Yes                                |
| Exact  | `/foo`                          | `/foo`                        | Yes                                |
| Exact  | `/foo`                          | `/bar`                        | No                                 |
| Exact  | `/foo`                          | `/foo/`                       | No                                 |
| Exact  | `/foo/`                         | `/foo`                        | No                                 |
| Prefix | `/foo`                          | `/foo`, `/foo/`               | Yes                                |
| Prefix | `/foo/`                         | `/foo`, `/foo/`               | Yes                                |
| Prefix | `/aaa/bb`                       | `/aaa/bbb`                    | No                                 |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb`                    | Yes                                |
| Prefix | `/aaa/bbb/`                     | `/aaa/bbb`                    | Yes, ignores trailing slash        |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb/`                   | Yes,  matches trailing slash       |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb/ccc`                | Yes, matches subpath               |
| Prefix | `/aaa/bbb`                      | `/aaa/bbbxyz`                 | No, does not match string prefix   |
| Prefix | `/`, `/aaa`                     | `/aaa/ccc`                    | Yes, matches `/aaa` prefix         |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/aaa/bbb`                    | Yes, matches `/aaa/bbb` prefix     |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/ccc`                        | Yes, matches `/` prefix            |
| Prefix | `/aaa`                          | `/ccc`                        | No, uses default backend           |
| Mixed  | `/foo` (Prefix), `/foo` (Exact) | `/foo`                        | Yes, prefers Exact                 |

#### Multiple matches

In some cases, multiple paths within an Ingress will match a request. In those
cases precedence will be given first to the longest matching path. If two paths
are still equally matched, precedence will be given to paths with an exact path
type over prefix path type.

## Hostname wildcards

Hosts can be precise matches (for example “`foo.bar.com`”) or a wildcard (for
example “`*.foo.com`”). Precise matches require that the HTTP `host` header
matches the `host` field. Wildcard matches require the HTTP `host` header is
equal to the suffix of the wildcard rule.

| Host        | Host header       | Match?                                            |
| ----------- |-------------------| --------------------------------------------------|
| `*.foo.com` | `bar.foo.com`     | Matches based on shared suffix                    |
| `*.foo.com` | `baz.bar.foo.com` | No match, wildcard only covers a single DNS label |
| `*.foo.com` | `foo.com`         | No match, wildcard only covers a single DNS label |

{{% code_sample file="service/networking/ingress-wildcard-host.yaml" %}}

## Ingress class

Ingresses can be implemented by different controllers, often with different
configuration. Each Ingress should specify a class, a reference to an
IngressClass resource that contains additional configuration including the name
of the controller that should implement the class.

{{% code_sample file="service/networking/external-lb.yaml" %}}

The `.spec.parameters` field of an IngressClass lets you reference another
resource that provides configuration related to that IngressClass.

The specific type of parameters to use depends on the ingress controller
that you specify in the `.spec.controller` field of the IngressClass.

### IngressClass scope

Depending on your ingress controller, you may be able to use parameters
that you set cluster-wide, or just for one namespace.

{{< tabs name="tabs_ingressclass_parameter_scope" >}}
{{% tab name="Cluster" %}}
The default scope for IngressClass parameters is cluster-wide.

If you set the `.spec.parameters` field and don't set
`.spec.parameters.scope`, or if you set `.spec.parameters.scope` to
`Cluster`, then the IngressClass refers to a cluster-scoped resource.
The `kind` (in combination the `apiGroup`) of the parameters
refers to a cluster-scoped API (possibly a custom resource), and
the `name` of the parameters identifies a specific cluster scoped
resource for that API.

For example:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-1
spec:
  controller: example.com/ingress-controller
  parameters:
    # The parameters for this IngressClass are specified in a
    # ClusterIngressParameter (API group k8s.example.net) named
    # "external-config-1". This definition tells Kubernetes to
    # look for a cluster-scoped parameter resource.
    scope: Cluster
    apiGroup: k8s.example.net
    kind: ClusterIngressParameter
    name: external-config-1
```

{{% /tab %}}
{{% tab name="Namespaced" %}}
{{< feature-state for_k8s_version="v1.23" state="stable" >}}

If you set the `.spec.parameters` field and set
`.spec.parameters.scope` to `Namespace`, then the IngressClass refers
to a namespaced-scoped resource. You must also set the `namespace`
field within `.spec.parameters` to the namespace that contains
the parameters you want to use.

The `kind` (in combination the `apiGroup`) of the parameters
refers to a namespaced API (for example: ConfigMap), and
the `name` of the parameters identifies a specific resource
in the namespace you specified in `namespace`.

Namespace-scoped parameters help the cluster operator delegate control over the
configuration (for example: load balancer settings, API gateway definition)
that is used for a workload. If you used a cluster-scoped parameter then either:

- the cluster operator team needs to approve a different team's changes every
  time there's a new configuration change being applied.
- the cluster operator must define specific access controls, such as
  [RBAC](/docs/reference/access-authn-authz/rbac/) roles and bindings, that let
  the application team make changes to the cluster-scoped parameters resource.

The IngressClass API itself is always cluster-scoped.

Here is an example of an IngressClass that refers to parameters that are
namespaced:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-2
spec:
  controller: example.com/ingress-controller
  parameters:
    # The parameters for this IngressClass are specified in an
    # IngressParameter (API group k8s.example.com) named "external-config",
    # that's in the "external-configuration" namespace.
    scope: Namespace
    apiGroup: k8s.example.com
    kind: IngressParameter
    namespace: external-configuration
    name: external-config
```

{{% /tab %}}
{{< /tabs >}}

### Deprecated annotation

Before the IngressClass resource and `ingressClassName` field were added in
Kubernetes 1.18, Ingress classes were specified with a
`kubernetes.io/ingress.class` annotation on the Ingress. This annotation was
never formally defined, but was widely supported by Ingress controllers.

The newer `ingressClassName` field on Ingresses is a replacement for that
annotation, but is not a direct equivalent. While the annotation was generally
used to reference the name of the Ingress controller that should implement the
Ingress, the field is a reference to an IngressClass resource that contains
additional Ingress configuration, including the name of the Ingress controller.

### Default IngressClass {#default-ingress-class}

You can mark a particular IngressClass as default for your cluster. Setting the
`ingressclass.kubernetes.io/is-default-class` annotation to `true` on an
IngressClass resource will ensure that new Ingresses without an
`ingressClassName` field specified will be assigned this default IngressClass.

{{< caution >}}
If you have more than one IngressClass marked as the default for your cluster,
the admission controller prevents creating new Ingress objects that don't have
an `ingressClassName` specified. You can resolve this by ensuring that at most 1
IngressClass is marked as default in your cluster.
{{< /caution >}}

There are some ingress controllers, that work without the definition of a
default `IngressClass`. For example, the Ingress-NGINX controller can be
configured with a [flag](https://kubernetes.github.io/ingress-nginx/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class`. It is [recommended](https://kubernetes.github.io/ingress-nginx/#i-have-only-one-instance-of-the-ingresss-nginx-controller-in-my-cluster-what-should-i-do)  though, to specify the
default `IngressClass`:

{{% code_sample file="service/networking/default-ingressclass.yaml" %}}

## Types of Ingress

### Ingress backed by a single Service {#single-service-ingress}

There are existing Kubernetes concepts that allow you to expose a single Service
(see [alternatives](#alternatives)). You can also do this with an Ingress by specifying a
*default backend* with no rules.

{{% code_sample file="service/networking/test-ingress.yaml" %}}

If you create it using `kubectl apply -f` you should be able to view the state
of the Ingress you added:

```bash
kubectl get ingress test-ingress
```

```
NAME           CLASS         HOSTS   ADDRESS         PORTS   AGE
test-ingress   external-lb   *       203.0.113.123   80      59s
```

Where `203.0.113.123` is the IP allocated by the Ingress controller to satisfy
this Ingress.

{{< note >}}
Ingress controllers and load balancers may take a minute or two to allocate an IP address.
Until that time, you often see the address listed as `<pending>`.
{{< /note >}}

### Simple fanout

A fanout configuration routes traffic from a single IP address to more than one Service,
based on the HTTP URI being requested. An Ingress allows you to keep the number of load balancers
down to a minimum. For example, a setup like:

{{< figure src="/docs/images/ingressFanOut.svg" alt="ingress-fanout-diagram" class="diagram-large" caption="Figure. Ingress Fan Out" link="https://mermaid.live/edit#pako:eNqNUslOwzAQ_RXLvYCUhMQpUFzUUzkgcUBwbHpw4klr4diR7bCo8O8k2FFbFomLPZq3jP00O1xpDpjijWHtFt09zAuFUCUFKHey8vf6NE7QrdoYsDZumGIb4Oi6NAskNeOoZJKpCgxK4oXwrFVgRyi7nCVXWZKRPMlysv5yD6Q4Xryf1Vq_WzDPooJs9egLNDbolKTpT03JzKgh3zWEztJZ0Niu9L-qZGcdmAMfj4cxvWmreba613z9C0B-AMQD-V_AdA-A4j5QZu0SatRKJhSqhZR0wjmPrDP6CeikrutQxy-Cuy2dtq9RpaU2dJKm6fzI5Glmg0VOLio4_5dLjx27hFSC015KJ2VZHtuQvY2fuHcaE43G0MaCREOow_FV5cMxHZ5-oPX75UM5avuXhXuOI9yAaZjg_aLuBl6B3RYaKDDtSw4166QrcKE-emrXcubghgunDaY1kxYizDqnH99UhakzHYykpWD9hjS--fEJoIELqQ" >}}

It would require an Ingress such as:

{{% code_sample file="service/networking/simple-fanout-example.yaml" %}}

When you create the Ingress with `kubectl apply -f`:

```shell
kubectl describe ingress simple-fanout-example
```

```
Name:             simple-fanout-example
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:4200 (10.8.0.90:4200)
               /bar   service2:8080 (10.8.0.91:8080)
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

The Ingress controller provisions an implementation-specific load balancer
that satisfies the Ingress, as long as the Services (`service1`, `service2`) exist.
When it has done so, you can see the address of the load balancer at the
Address field.

{{< note >}}
Depending on the [Ingress controller](/docs/concepts/services-networking/ingress-controllers/)
you are using, you may need to create a default-http-backend
[Service](/docs/concepts/services-networking/service/).
{{< /note >}}

### Name based virtual hosting

Name-based virtual hosts support routing HTTP traffic to multiple host names at the same IP address.

{{< figure src="/docs/images/ingressNameBased.svg" alt="ingress-namebase-diagram" class="diagram-large" caption="Figure. Ingress Name Based Virtual hosting" link="https://mermaid.live/edit#pako:eNqNkl9PwyAUxb8KYS-atM1Kp05m9qSJJj4Y97jugcLtRqTQAPVPdN_dVlq3qUt8gZt7zvkBN7xjbgRgiteW1Rt0_zjLNUJcSdD-ZBn21WmcoDu9tuBcXDHN1iDQVWHnSBkmUMEU0xwsSuK5DK5l745QejFNLtMkJVmSZmT1Re9NcTz_uDXOU1QakxTMJtxUHw7ss-SQLhehQEODTsdH4l20Q-zFyc84-Y67pghv5apxHuweMuj9eS2_NiJdPhix-kMgvwQShOyYMNkJoEUYM3PuGkpUKyY1KqVSdCSEiJy35gnoqCzLvo5fpPAbOqlfI26UsXQ0Ho9nB5CnqesRGTnncPYvSqsdUvqp9KRdlI6KojjEkB0mnLgjDRONhqENBYm6oXbLV5V1y6S7-l42_LowlIN2uFm_twqOcAW2YlK0H_i9c-bYb6CCHNO2FFCyRvkc53rbWptaMA83QnpjMS2ZchBh1nizeNMcU28bGEzXkrV_pArN7Sc0rBTu" >}}

The following Ingress tells the backing load balancer to route requests based on
the [Host header](https://tools.ietf.org/html/rfc7230#section-5.4).

{{% code_sample file="service/networking/name-virtual-host-ingress.yaml" %}}

If you create an Ingress resource without any hosts defined in the rules, then any
web traffic to the IP address of your Ingress controller can be matched without a name based
virtual host being required.

For example, the following Ingress routes traffic
requested for `first.bar.com` to `service1`, `second.bar.com` to `service2`,
and any traffic whose request host header doesn't match `first.bar.com`
and `second.bar.com` to `service3`.

{{% code_sample file="service/networking/name-virtual-host-ingress-no-third-host.yaml" %}}

### TLS

You can secure an Ingress by specifying a {{< glossary_tooltip term_id="secret" >}}
that contains a TLS private key and certificate. The Ingress resource only
supports a single TLS port, 443, and assumes TLS termination at the ingress point
(traffic to the Service and its Pods is in plaintext).
If the TLS configuration section in an Ingress specifies different hosts, they are
multiplexed on the same port according to the hostname specified through the
SNI TLS extension (provided the Ingress controller supports SNI). The TLS secret
must contain keys named `tls.crt` and `tls.key` that contain the certificate
and private key to use for TLS. For example:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
data:
  tls.crt: base64 encoded cert
  tls.key: base64 encoded key
type: kubernetes.io/tls
```

Referencing this secret in an Ingress tells the Ingress controller to
secure the channel from the client to the load balancer using TLS. You need to make
sure the TLS secret you created came from a certificate that contains a Common
Name (CN), also known as a Fully Qualified Domain Name (FQDN) for `https-example.foo.com`.

{{< note >}}
Keep in mind that TLS will not work on the default rule because the
certificates would have to be issued for all the possible sub-domains. Therefore,
`hosts` in the `tls` section need to explicitly match the `host` in the `rules`
section.
{{< /note >}}

{{% code_sample file="service/networking/tls-example-ingress.yaml" %}}

{{< note >}}
There is a gap between TLS features supported by various Ingress
controllers. Please refer to documentation on
[nginx](https://kubernetes.github.io/ingress-nginx/user-guide/tls/),
[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https), or any other
platform specific Ingress controller to understand how TLS works in your environment.
{{< /note >}}

### Load balancing {#load-balancing}

An Ingress controller is bootstrapped with some load balancing policy settings
that it applies to all Ingress, such as the load balancing algorithm, backend
weight scheme, and others. More advanced load balancing concepts
(e.g. persistent sessions, dynamic weights) are not yet exposed through the
Ingress. You can instead get these features through the load balancer used for
a Service.

It's also worth noting that even though health checks are not exposed directly
through the Ingress, there exist parallel concepts in Kubernetes such as
[readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
that allow you to achieve the same end result. Please review the controller
specific documentation to see how they handle health checks (for example:
[nginx](https://git.k8s.io/ingress-nginx/README.md), or
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)).

## Updating an Ingress

To update an existing Ingress to add a new Host, you can update it by editing the resource:

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     35s                loadbalancer-controller  default/test
```

```shell
kubectl edit ingress test
```

This pops up an editor with the existing configuration in YAML format.
Modify it to include the new Host:

```yaml
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          service:
            name: service1
            port:
              number: 80
        path: /foo
        pathType: Prefix
  - host: bar.baz.com
    http:
      paths:
      - backend:
          service:
            name: service2
            port:
              number: 80
        path: /foo
        pathType: Prefix
..
```

After you save your changes, kubectl updates the resource in the API server, which tells the
Ingress controller to reconfigure the load balancer.

Verify this:

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
  bar.baz.com
               /foo   service2:80 (10.8.0.91:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     45s                loadbalancer-controller  default/test
```

You can achieve the same outcome by invoking `kubectl replace -f` on a modified Ingress YAML file.

## Failing across availability zones

Techniques for spreading traffic across failure domains differ between cloud providers.
Please check the documentation of the relevant [Ingress controller](/docs/concepts/services-networking/ingress-controllers) for details.

## Alternatives

You can expose a Service in multiple ways that don't directly involve the Ingress resource:

* Use [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer)
* Use [Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport)

## {{% heading "whatsnext" %}}

* Learn about the [Ingress](/docs/reference/kubernetes-api/service-resources/ingress-v1/) API
* Learn about [Ingress controllers](/docs/concepts/services-networking/ingress-controllers/)
* [Set up Ingress on Minikube with the NGINX Controller](/docs/tasks/access-application-cluster/ingress-minikube/)
