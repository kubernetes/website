---
layout: blog
title: "Deprecation and removal of Service ExternalIPs"
draft: true # will be changed to date: YYYY-MM-DD before publication
slug: deprecation-and-removal-of-service-externalips # optional
author: >
  Dan Winship (Red Hat),
  Adrian Moisey (Independant),
---

The `externalIPs` field in `Service` was an early attempt to provide
cloud-load-balancer-like functionality for non-cloud clusters.
Unfortunately, the API assumes that every user in the cluster is fully
trusted, and in any situation where that is not the case, it enables
various security exploits, as described in
[CVE-2020-8554](https://www.cvedetails.com/cve/CVE-2020-8554/).

Since Kubernetes 1.21, we have recommended that all users disable
`externalIPs`, and provided an admission controller
(`denyservicexternalips`) that can be enabled to do this. At the time,
we felt that blocking the functionality by default was too large a
breaking change to consider.

However, the security problems are still there, and we're increasingly
unhappy with the "insecure by default" state of the feature.
Additionally, there are now several better alternatives for non-cloud
clusters wanting load-balancer-like functionality.

So, as of Kubernetes 1.36 we are declaring the Service `externalIPs`
field to be deprecated, and in a future release we plan to remove the
implementation of the feature from `kube-proxy`, and update the
Kubernetes Conformance criteria to require that it not be implemented
by other service proxies either.

## A note on terminology, and what we *aren't* deprecating

The phrase "external IP" is somewhat overloaded in Kubernetes:

  - The Service API has a field `.spec.externalIPs` which can be used
    to add additional IP addresses that a Service will respond on.

  - The Node API's `.status.addresses` field can list addresses of
    several different types, one of which is called `ExternalIP`.

  - Kubelet, when displaying information about a Service of type
    `LoadBalancer` in the default output format, will show the load
    balancer IP under the column heading `EXTERNAL-IP`.

This deprecation is about the first of those. If you are not setting
the field `externalIPs` in any of your Services, then it does not
apply to you.

## Alternatives to `externalIPs`

If you *are* using `externalIPs`, then there are several alternatives.

### Using manually-managed `LoadBalancer` Services instead of `externalIPs`

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

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-example-service
spec:
  loadBalancerClass: non-existent-class
  type: LoadBalancer
  selector:
    app: my-example-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

(note that it is required to set the loadBalancerClass to a non-existant load balancer controller in order to
ensure make sure that no controller tries to manage this service)

Then patch that service with the IP address that you require:

```shell
kubectl patch service my-example-service --subresource=status --type=merge -p '{"status":{"loadBalancer":{"ingress":[{"ip":"192.0.2.4"}]}}}'
```

### Limiting access using VAP

FIXME, using VAP to limit users to particular CIDRs
(or not, if we don't want to encourage this approach?)

ADRIAN TODO: Mention that this can be done using VAP, don't give examples.

### Using a "bare metal" load balancer implementation

Tools such as [MetalLB](https://metallb.io/usage/) provide ways for cluster administrators to
configure and manage the IP addresses that Kubernetes Load balancer use. More information can be
found at the [MetalLB website](https://metallb.io/usage/).

After installing MetalLB a cluster administrator can configure a pool of IP addresses for use in the cluster:

```yaml
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: production
  namespace: metallb-system
spec:
  addresses:
  - 42.176.25.64/30
  autoAssign: true
  avoidBuggyIPs: false
```

After which a user can create a Loadbalancer Service and MetalLB will handle the assignment of the IP address.

This approach can allow cluster administrators to have control over which IP addresses are assigned,
rather than users.

### Using Gateway API

A potential alternative solution is to use the [Gateway API](https://gateway-api.sigs.k8s.io/) project.

Gateway API allows cluster administrators to define a Gateway resource, which can have an IP address
attached to it via the `.spec.addresses` field. Since Gateway resources are designed to be managed by
[cluster administrators](https://gateway-api.sigs.k8s.io/concepts/security/), rules can be put in place to only allows privileged used to manage them.

One caveat is that the `.spec.addresses` field of the Gateway resource is implementaion specific, please
consult the documentation for the implementaion for more details.

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
  hostnames:
  - "example.com"
  rules:
  - backendRefs:
    - name: example-svc
      port: 80
```

full-featured, future-proof, extensible, but requires the most changes
to existing services.

## Timeline for `externalIPs` deprecation

FIXME: Dan to make these words betterer

The rough timeline for this deprecation is as follows:

1. In Kubernetes 1.36 we start the deprecation and add warnings when a user uses this feature
2. Four releases later - support for externalIPs will be disabled in kube-proxy, but users can still opt-in should they require more time to migrate away
3. Three releases later - support will be disabled completely and users can't reeable it
