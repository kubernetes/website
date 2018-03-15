---
reviewers:
- bprashanth
title: Ingress
---

{% capture overview %}
{% glossary_definition term_id="ingress" length="all" %}
{% endcapture %}

{% capture body %}
__Terminology__

Throughout this doc you will see a few terms that are sometimes used interchangeably elsewhere, that might cause confusion. This section attempts to clarify them.

* Node: A single virtual or physical machine in a Kubernetes cluster.
* Cluster: A group of nodes firewalled from the internet, that are the primary compute resources managed by Kubernetes.
* Edge router: A router that enforces the firewall policy for your cluster. This could be a gateway managed by a cloud provider or a physical piece of hardware.
* Cluster network: A set of links, logical or physical, that facilitate communication within a cluster according to the [Kubernetes networking model](/docs/concepts/cluster-administration/networking/). Examples of a Cluster network include Overlays such as [flannel](https://github.com/coreos/flannel#flannel) or SDNs such as [OVS](https://www.openvswitch.org/).
* Service: A Kubernetes [Service](/docs/concepts/services-networking/service/) that identifies a set of pods using label selectors. Unless mentioned otherwise, Services are assumed to have virtual IPs only routable within the cluster network.

## What is Ingress?

Typically, services and pods have IPs only routable by the cluster network. All traffic that ends up at an edge router is either dropped or forwarded elsewhere. Conceptually, this might look like:

```
    internet
        |
  ------------
  [ Services ]
```

An Ingress is a collection of rules that allow inbound connections to reach the cluster services.

```
    internet
        |
   [ Ingress ]
   --|-----|--
   [ Services ]
```

It can be configured to give services externally-reachable URLs, load balance traffic, terminate SSL, offer name based virtual hosting, and more. Users request ingress by POSTing the Ingress resource to the API server. An [Ingress controller](#ingress-controllers) is responsible for fulfilling the Ingress, usually with a loadbalancer, though it may also configure your edge router or additional frontends to help handle the traffic in an HA manner.

## Prerequisites

Before you start using the Ingress resource, there are a few things you should understand. The Ingress is a beta resource, not available in any Kubernetes release prior to 1.1. You need an Ingress controller to satisfy an Ingress, simply creating the resource will have no effect.

GCE/Google Kubernetes Engine deploys an ingress controller on the master. You can deploy any number of custom ingress controllers in a pod. You must annotate each ingress with the appropriate class, as indicated [here](https://git.k8s.io/ingress#running-multiple-ingress-controllers) and [here](https://git.k8s.io/ingress-gce/BETA_LIMITATIONS.md#disabling-glbc).

Make sure you review the [beta limitations](https://github.com/kubernetes/ingress-gce/blob/master/BETA_LIMITATIONS.md#glbc-beta-limitations) of this controller. In environments other than GCE/Google Kubernetes Engine, you need to [deploy a controller](https://git.k8s.io/ingress-nginx/README.md) as a pod.

## The Ingress Resource

A minimal Ingress might look like:

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

*POSTing this to the API server will have no effect if you have not configured an [Ingress controller](#ingress-controllers).*

__Lines 1-6__: As with all other Kubernetes config, an Ingress needs `apiVersion`, `kind`, and `metadata` fields.  For general information about working with config files, see [deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/), [configuring containers](/docs/tasks/configure-pod-container/configure-pod-configmap/), [managing resources](/docs/concepts/cluster-administration/manage-deployment/) and [ingress configuration rewrite](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md).

__Lines 7-9__: Ingress [spec](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status) has all the information needed to configure a loadbalancer or proxy server. Most importantly, it contains a list of rules matched against all incoming requests. Currently the Ingress resource only supports http rules.

__Lines 10-11__: Each http rule contains the following information: A host (e.g.: foo.bar.com, defaults to * in this example), a list of paths (e.g.: /testpath) each of which has an associated backend (test:80). Both the host and path must match the content of an incoming request before the loadbalancer directs traffic to the backend.

__Lines 12-14__: A backend is a service:port combination as described in the [services doc](/docs/concepts/services-networking/service/). Ingress traffic is typically sent directly to the endpoints matching a backend.

__Global Parameters__: For the sake of simplicity the example Ingress has no global parameters, see the [API reference](https://releases.k8s.io/{{page.githubbranch}}/staging/src/k8s.io/api/extensions/v1beta1/types.go) for a full definition of the resource. One can specify a global default backend in the absence of which requests that don't match a path in the spec are sent to the default backend of the Ingress controller.

## Ingress controllers

In order for the Ingress resource to work, the cluster must have an Ingress controller running. This is unlike other types of controllers, which typically run as part of the `kube-controller-manager` binary, and which are typically started automatically as part of cluster creation. You need to choose the ingress controller implementation that is the best fit for your cluster, or implement one. We currently support and maintain [GCE](https://git.k8s.io/ingress-gce/README.md) and [nginx](https://git.k8s.io/ingress-nginx/README.md) controllers.

## Before you begin

The following document describes a set of cross platform features exposed through the Ingress resource. Ideally, all Ingress controllers should fulfill this specification, but we're not there yet. We currently support and maintain [GCE](https://git.k8s.io/ingress-gce/README.md) and [nginx](https://git.k8s.io/ingress-nginx/README.md) controllers. **Make sure you review controller specific docs so you understand the caveats of each one**.

## Types of Ingress

### Single Service Ingress

There are existing Kubernetes concepts that allow you to expose a single service (see [alternatives](#alternatives)), however you can do so through an Ingress as well, by specifying a *default backend* with no rules.

{% include code.html language="yaml" file="ingress.yaml" ghlink="/docs/concepts/services-networking/ingress.yaml" %}

If you create it using `kubectl create -f` you should see:

```shell
$ kubectl get ing
NAME                RULE          BACKEND        ADDRESS
test-ingress        -             testsvc:80     107.178.254.228
```

Where `107.178.254.228` is the IP allocated by the Ingress controller to satisfy this Ingress. The `RULE` column shows that all traffic sent to the IP is directed to the Kubernetes Service listed under `BACKEND`.

### Simple fanout

As described previously, pods within kubernetes have IPs only visible on the cluster network, so we need something at the edge accepting ingress traffic and proxying it to the right endpoints. This component is usually a highly available loadbalancer. An Ingress allows you to keep the number of loadbalancers down to a minimum, for example, a setup like:

```shell
foo.bar.com -> 178.91.123.132 -> / foo    s1:80
                                 / bar    s2:80
```

would require an Ingress such as:

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: test
  annotations:
    ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - path: /foo
        backend:
          serviceName: s1
          servicePort: 80
      - path: /bar
        backend:
          serviceName: s2
          servicePort: 80
```

When you create the Ingress with `kubectl create -f`:

```shell
$ kubectl get ing
NAME      RULE          BACKEND   ADDRESS
test      -
          foo.bar.com
          /foo          s1:80
          /bar          s2:80
```
The Ingress controller will provision an implementation specific loadbalancer that satisfies the Ingress, as long as the services (s1, s2) exist. When it has done so, you will see the address of the loadbalancer under the last column of the Ingress.

### Name based virtual hosting

Name-based virtual hosts use multiple host names for the same IP address.

```
foo.bar.com --|                 |-> foo.bar.com s1:80
              | 178.91.123.132  |
bar.foo.com --|                 |-> bar.foo.com s2:80
```

The following Ingress tells the backing loadbalancer to route requests based on the [Host header](https://tools.ietf.org/html/rfc7230#section-5.4).

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: test
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          serviceName: s1
          servicePort: 80
  - host: bar.foo.com
    http:
      paths:
      - backend:
          serviceName: s2
          servicePort: 80
```

__Default Backends__: An Ingress with no rules, like the one shown in the previous section, sends all traffic to a single default backend. You can use the same technique to tell a loadbalancer where to find your website's 404 page, by specifying a set of rules *and* a default backend. Traffic is routed to your default backend if none of the Hosts in your Ingress match the Host in the request header, and/or none of the paths match the URL of the request.

### TLS

You can secure an Ingress by specifying a [secret](/docs/user-guide/secrets) that contains a TLS private key and certificate. Currently the Ingress only supports a single TLS port, 443, and assumes TLS termination. If the TLS configuration section in an Ingress specifies different hosts, they will be multiplexed on the same port according to the hostname specified through the SNI TLS extension (provided the Ingress controller supports SNI). The TLS secret must contain keys named `tls.crt` and `tls.key` that contain the certificate and private key to use for TLS, e.g.:

```yaml
apiVersion: v1
data:
  tls.crt: base64 encoded cert
  tls.key: base64 encoded key
kind: Secret
metadata:
  name: testsecret
  namespace: default
type: Opaque
```

Referencing this secret in an Ingress will tell the Ingress controller to secure the channel from the client to the loadbalancer using TLS:

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: no-rules-map
spec:
  tls:
  - secretName: testsecret
  backend:
    serviceName: s1
    servicePort: 80
```

Note that there is a gap between TLS features supported by various Ingress controllers. Please refer to documentation on [nginx](https://git.k8s.io/ingress-nginx/README.md#https), [GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https), or any other platform specific Ingress controller to understand how TLS works in your environment.

### Loadbalancing

An Ingress controller is bootstrapped with some load balancing policy settings that it applies to all Ingress, such as the load balancing algorithm, backend weight scheme, and others. More advanced load balancing concepts (e.g.: persistent sessions, dynamic weights) are not yet exposed through the Ingress. You can still get these features through the [service loadbalancer](https://github.com/kubernetes/ingress-nginx/blob/master/docs/catalog.md). With time, we plan to distill load balancing patterns that are applicable cross platform into the Ingress resource.

It's also worth noting that even though health checks are not exposed directly through the Ingress, there exist parallel concepts in Kubernetes such as [readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) which allow you to achieve the same end result. Please review the controller specific docs to see how they handle health checks ([nginx](https://git.k8s.io/ingress-nginx/README.md), [GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)).

## Updating an Ingress

Say you'd like to add a new Host to an existing Ingress, you can update it by editing the resource:

```shell
$ kubectl get ing
NAME      RULE          BACKEND   ADDRESS
test      -                       178.91.123.132
          foo.bar.com
          /foo          s1:80
$ kubectl edit ing test
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

Saving the yaml will update the resource in the API server, which should tell the Ingress controller to reconfigure the loadbalancer.

```shell
$ kubectl get ing
NAME      RULE          BACKEND   ADDRESS
test      -                       178.91.123.132
          foo.bar.com
          /foo          s1:80
          bar.baz.com
          /foo          s2:80
```

You can achieve the same by invoking `kubectl replace -f` on a modified Ingress yaml file.

## Failing across availability zones

Techniques for spreading traffic across failure domains differs between cloud providers. Please check the documentation of the relevant Ingress controller for details. Please refer to the federation [doc](/docs/concepts/cluster-administration/federation/) for details on deploying Ingress in a federated cluster.

## Future Work

* Various modes of HTTPS/TLS support (e.g.: SNI, re-encryption)
* Requesting an IP or Hostname via claims
* Combining L4 and L7 Ingress
* More Ingress controllers

Please track the [L7 and Ingress proposal](https://github.com/kubernetes/kubernetes/pull/12827) for more details on the evolution of the resource, and the [Ingress repository](https://github.com/kubernetes/ingress/tree/master) for more details on the evolution of various Ingress controllers.

## Alternatives

You can expose a Service in multiple ways that don't directly involve the Ingress resource:

* Use [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#type-loadbalancer)
* Use [Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport)
* Use a [Port Proxy](https://git.k8s.io/contrib/for-demos/proxy-to-service)
{% endcapture %}

{% include templates/concept.md %}
