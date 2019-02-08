---
reviewers:
- bprashanth
title: Ingress
content_template: templates/concept
weight: 40
---

{{% capture overview %}}
{{< glossary_definition term_id="ingress" length="all" >}}
{{% /capture %}}

{{% capture body %}}
## Terminology

For the sake of clarity, this guide defines the following terms:

* Node: A single virtual or physical machine in a Kubernetes cluster.
* Cluster: A group of nodes firewalled from the internet, that are the primary compute resources managed by Kubernetes.
* Edge router: A router that enforces the firewall policy for your cluster. This could be a gateway managed by a cloud provider or a physical piece of hardware.
* Cluster network: A set of links, logical or physical, that facilitate communication within a cluster according to the [Kubernetes networking model](/docs/concepts/cluster-administration/networking/).
* Service: A Kubernetes [Service](/docs/concepts/services-networking/service/) that identifies a set of pods using label selectors. Unless mentioned otherwise, Services are assumed to have virtual IPs only routable within the cluster network.

## What is Ingress?

Ingress, added in Kubernetes v1.1, exposes HTTP and HTTPS routes from outside the cluster to
{{< link text="services" url="/docs/concepts/services-networking/service/" >}} within the cluster.
Traffic routing is controlled by rules defined on the ingress resource.

```none
    internet
        |
   [ Ingress ]
   --|-----|--
   [ Services ]
```

An ingress can be configured to give services externally-reachable URLs, load balance traffic, terminate SSL, and offer name based virtual hosting. An [ingress controller](#ingress-controllers) is responsible for fulfilling the ingress, usually with a loadbalancer, though it may also configure your edge router or additional frontends to help handle the traffic.

An ingress does not expose arbitrary ports or protocols. Exposing services other than HTTP and HTTPS to the internet typically
uses a service of type [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport) or
[Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer).

## Prerequisites

{{< feature-state for_k8s_version="v1.1" state="beta" >}}

Before you start using an ingress, there are a few things you should understand. The ingress is a beta resource. You will need an ingress controller to satisfy an ingress, simply creating the resource will have no effect.

GCE/Google Kubernetes Engine deploys an [ingress controller](#ingress-controllers) on the master. Review the
[beta limitations](https://github.com/kubernetes/ingress-gce/blob/master/BETA_LIMITATIONS.md#glbc-beta-limitations)
of this controller if you are using GCE/GKE.

In environments other than GCE/Google Kubernetes Engine, you may need to
[deploy an ingress controller](https://kubernetes.github.io/ingress-nginx/deploy/). There are a number of
[ingress controller](#ingress-controllers) you may choose from.

## Ingress controllers

In order for the ingress resource to work, the cluster must have an ingress controller running. This is unlike other types of controllers, which run as part of the `kube-controller-manager` binary, and are typically started automatically with a cluster. Choose the ingress controller implementation that best fits your cluster.

* Kubernetes as a project currently supports and maintains [GCE](https://git.k8s.io/ingress-gce/README.md) and
  [nginx](https://git.k8s.io/ingress-nginx/README.md) controllers.

Additional controllers include:

* [Contour](https://github.com/heptio/contour) is an [Envoy](https://www.envoyproxy.io) based ingress controller
  provided and supported by Heptio.
* Citrix provides an [Ingress Controller](https://github.com/citrix/citrix-k8s-ingress-controller) for its hardware (MPX), virtualized (VPX) and [free containerized (CPX) ADC](https://www.citrix.com/products/citrix-adc/cpx-express.html) for [baremetal](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment/baremetal) and [cloud](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment) deployments.
* F5 Networks provides [support and maintenance](https://support.f5.com/csp/article/K86859508)
  for the [F5 BIG-IP Controller for Kubernetes](http://clouddocs.f5.com/products/connectors/k8s-bigip-ctlr/latest).
* [Gloo](https://gloo.solo.io) is an open-source ingress controller based on [Envoy](https://www.envoyproxy.io) which offers API Gateway functionality with enterprise support from [solo.io](https://www.solo.io).  
* [HAProxy](http://www.haproxy.org/) based ingress controller
  [jcmoraisjr/haproxy-ingress](https://github.com/jcmoraisjr/haproxy-ingress) which is mentioned on the blog post
  [HAProxy Ingress Controller for Kubernetes](https://www.haproxy.com/blog/haproxy_ingress_controller_for_kubernetes/).
  [HAProxy Technologies](https://www.haproxy.com/) offers support and maintenance for HAProxy Enterprise and
  the ingress controller [jcmoraisjr/haproxy-ingress](https://github.com/jcmoraisjr/haproxy-ingress).
* [Istio](https://istio.io/) based ingress controller
  [Control Ingress Traffic](https://istio.io/docs/tasks/traffic-management/ingress/).
* [Kong](https://konghq.com/) offers [community](https://discuss.konghq.com/c/kubernetes) or
  [commercial](https://konghq.com/kong-enterprise/) support and maintenance for the
  [Kong Ingress Controller for Kubernetes](https://github.com/Kong/kubernetes-ingress-controller).
* [NGINX, Inc.](https://www.nginx.com/) offers support and maintenance for the
  [NGINX Ingress Controller for Kubernetes](https://www.nginx.com/products/nginx/kubernetes-ingress-controller).
* [Traefik](https://github.com/containous/traefik) is a fully featured ingress controller
  ([Let's Encrypt](https://letsencrypt.org), secrets, http2, websocket), and it also comes with commercial
  support by [Containous](https://containo.us/services).

You may deploy [any number of ingress controllers](https://git.k8s.io/ingress-nginx/docs/user-guide/multiple-ingress.md#multiple-ingress-controllers) within a cluster.
When you create an ingress, you should annotate each ingress with the appropriate
[`ingress.class`](https://git.k8s.io/ingress-gce/docs/faq/README.md#how-do-i-run-multiple-ingress-controllers-in-the-same-cluster) to indicate which ingress
controller should be used if more than one exists within your cluster.
If you do not define a class, your cloud provider may use a default ingress provider.

### Before you begin

Ideally, all ingress controllers should fulfill this specification, but the various ingress
controllers operate slightly differently.

{{< note >}}
Make sure you review your ingress controller's documentation to understand the caveats of choosing it.
{{< /note >}}

## The Ingress Resource

A minimal ingress resource example:

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: test-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - http:
      paths:
      - path: /testpath
        backend:
          serviceName: test
          servicePort: 80
```

 As with all other Kubernetes resources, an ingress needs `apiVersion`, `kind`, and `metadata` fields.  
 For general information about working with config files, see [deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/), [configuring containers](/docs/tasks/configure-pod-container/configure-pod-configmap/), [managing resources](/docs/concepts/cluster-administration/manage-deployment/).
 Ingress frequently uses annotations to configure some options depending on the ingress controller, an example of which
 is the [rewrite-target annotation](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md).
 Different [ingress controller](#ingress-controllers) support different annotations. Review the documentation for
 your choice of ingress controller to learn which annotations are supported.

The ingress [spec](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status)
has all the information needed to configure a loadbalancer or proxy server. Most importantly, it
contains a list of rules matched against all incoming requests. Ingress resource only supports rules
for directing HTTP traffic.

### Ingress rules

Each http rule contains the following information:

* An optional host. In this example, no host is specified, so the rule applies to all inbound
  HTTP traffic through the IP address is specified. If a host is provided (for example,
  foo.bar.com), the rules apply to that host.
* a list of paths (for example, /testpath), each of which has an associated backend defined with a `serviceName`
  and `servicePort`. Both the host and path must match the content of an incoming request before the
  loadbalancer will direct traffic to the referenced service.
* A backend is a combination of service and port names as described in the
  [services doc](/docs/concepts/services-networking/service/). HTTP (and HTTPS) requests to the
  ingress matching the host and path of the rule will be sent to the listed backend.

A default backend is often configured in an ingress controller that will service any requests that do not
match a path in the spec.

### Default Backend

An ingress with no rules sends all traffic to a single default backend. The default
backend is typically a configuration option of the [ingress controller](#ingress-controllers)
and is not specified in your ingress resources.

If none of the hosts or paths match the HTTP request in the ingress objects, the traffic is
routed to your default backend.

## Types of Ingress

### Single Service Ingress

There are existing Kubernetes concepts that allow you to expose a single Service
(see [alternatives](#alternatives)). You can also do this with an ingress by specifying a
*default backend* with no rules.

{{< codenew file="service/networking/ingress.yaml" >}}

If you create it using `kubectl create -f` you should see:

```shell
kubectl get ingress test-ingress
```

```shell
NAME           HOSTS     ADDRESS           PORTS     AGE
test-ingress   *         107.178.254.228   80        59s
```

Where `107.178.254.228` is the IP allocated by the ingress controller to satisfy
this ingress.

{{< note >}}
Ingress controllers and load balancers may take a minute or two to allocate an IP address.
Until that time you will often see the address listed as `<pending>`.
{{< /note >}}

### Simple fanout

A fanout configuration routes traffic from a single IP address to more than one service,
based on the HTTP URI being requested. An ingress allows you to keep the number of loadbalancers
down to a minimum. For example, a setup like:

```shell
foo.bar.com -> 178.91.123.132 -> / foo    service1:4200
                                 / bar    service2:8080
```

would require an ingress such as:

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: simple-fanout-example
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - path: /foo
        backend:
          serviceName: service1
          servicePort: 4200
      - path: /bar
        backend:
          serviceName: service2
          servicePort: 8080
```

When you create the ingress with `kubectl create -f`:

```shell
kubectl describe ingress simple-fanout-example
```

```shell
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
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

The ingress controller will provision an implementation specific loadbalancer
that satisfies the ingress, as long as the services (`s1`, `s2`) exist.
When it has done so, you will see the address of the loadbalancer at the
Address field.

{{< note >}}
Depending on the [ingress controller](#ingress-controllers) you are using, you may need to
create a default-http-backend [Service](/docs/concepts/services-networking/service/).
{{< /note >}}

### Name based virtual hosting

Name-based virtual hosts support routing HTTP traffic to multiple host names at the same IP address.

```none
foo.bar.com --|                 |-> foo.bar.com s1:80
              | 178.91.123.132  |
bar.foo.com --|                 |-> bar.foo.com s2:80
```

The following ingress tells the backing loadbalancer to route requests based on
the [Host header](https://tools.ietf.org/html/rfc7230#section-5.4).

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: name-virtual-host-ingress
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          serviceName: service1
          servicePort: 80
  - host: bar.foo.com
    http:
      paths:
      - backend:
          serviceName: service2
          servicePort: 80
```

If you create an ingress resource without any hosts defined in the rules, then any
web traffic to the IP address of your ingress controller can be matched without a name based
virtual host being required. For example, the following ingress resource will route traffic 
requested for `first.bar.com` to `service1`, `second.foo.com` to `service2`, and any traffic
to the IP address without a hostname defined in request (that is, without a request header being
presented) to `service3`.

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: name-virtual-host-ingress
spec:
  rules:
  - host: first.bar.com
    http:
      paths:
      - backend:
          serviceName: service1
          servicePort: 80
  - host: second.foo.com
    http:
      paths:
      - backend:
          serviceName: service2
          servicePort: 80
  - http:
      paths:
      - backend:
          serviceName: service3
          servicePort: 80
```

### TLS

You can secure an ingress by specifying a [secret](/docs/concepts/configuration/secret)
that contains a TLS private key and certificate. Currently the ingress only
supports a single TLS port, 443, and assumes TLS termination. If the TLS
configuration section in an ingress specifies different hosts, they will be
multiplexed on the same port according to the hostname specified through the
SNI TLS extension (provided the ingress controller supports SNI). The TLS secret
must contain keys named `tls.crt` and `tls.key` that contain the certificate
and private key to use for TLS, e.g.:

```yaml
apiVersion: v1
data:
  tls.crt: base64 encoded cert
  tls.key: base64 encoded key
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
type: Opaque
```

Referencing this secret in an ingress will tell the ingress controller to
secure the channel from the client to the loadbalancer using TLS. You need to make
sure the TLS secret you created came from a certificate that contains a CN 
for `sslexample.foo.com`.

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: tls-example-ingress
spec:
  tls:
  - hosts:
    - sslexample.foo.com
    secretName: testsecret-tls
  rules:
    - host: sslexample.foo.com
      http:
        paths:
        - path: /
          backend:
            serviceName: service1
            servicePort: 80
```

{{< note >}}
There is a gap between TLS features supported by various ingress
controllers. Please refer to documentation on
[nginx](https://git.k8s.io/ingress-nginx/README.md#https),
[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https), or any other
platform specific ingress controller to understand how TLS works in your environment.
{{< /note >}}

### Loadbalancing

An ingress controller is bootstrapped with some load balancing policy settings
that it applies to all ingress, such as the load balancing algorithm, backend
weight scheme, and others. More advanced load balancing concepts
(e.g. persistent sessions, dynamic weights) are not yet exposed through the
ingress. You can still get these features through the
[service loadbalancer](https://github.com/kubernetes/ingress-nginx).

It's also worth noting that even though health checks are not exposed directly
through the ingress, there exist parallel concepts in Kubernetes such as
[readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)
which allow you to achieve the same end result. Please review the controller
specific docs to see how they handle health checks (
[nginx](https://git.k8s.io/ingress-nginx/README.md),
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)).

## Updating an Ingress

To update an existing ingress to add a new Host, you can update it by editing the resource:

```shell
kubectl describe ingress test
```

```shell
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   s1:80 (10.8.0.90:80)
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

This should pop up an editor with the existing yaml, modify it to include the new Host:

```yaml
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          serviceName: s1
          servicePort: 80
        path: /foo
  - host: bar.baz.com
    http:
      paths:
      - backend:
          serviceName: s2
          servicePort: 80
        path: /foo
..
```

Saving the yaml will update the resource in the API server, which should tell the
ingress controller to reconfigure the loadbalancer.

```shell
kubectl describe ingress test
```

```shell
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   s1:80 (10.8.0.90:80)
  bar.baz.com
               /foo   s2:80 (10.8.0.91:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     45s                loadbalancer-controller  default/test
```

You can achieve the same by invoking `kubectl replace -f` on a modified ingress yaml file.

## Failing across availability zones

Techniques for spreading traffic across failure domains differs between cloud providers.
Please check the documentation of the relevant [ingress controller](#ingress-controllers) for
details. You can also refer to the [federation documentation](/docs/concepts/cluster-administration/federation/)
for details on deploying ingress in a federated cluster.

## Future Work

Track [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network)
for more details on the evolution of the ingress and related resources. You may also track the
[ingress repository](https://github.com/kubernetes/ingress/tree/master) for more details on the
evolution of various ingress controllers.

## Alternatives

You can expose a Service in multiple ways that don't directly involve the ingress resource:

* Use [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer)
* Use [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport)
* Use a [Port Proxy](https://git.k8s.io/contrib/for-demos/proxy-to-service)

{{% /capture %}}

{{% capture whatsnext %}}

{{% /capture %}}

