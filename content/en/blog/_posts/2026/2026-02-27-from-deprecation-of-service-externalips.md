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
(`DenyServiceExternalIPs`) that can be enabled to do this. At the time,
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

Consider a Service like the following:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-example-service
spec:
  type: ClusterIP
  selector:
    app: my-example-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  externalIPs:
    - "192.0.2.4"
```

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

Because of the way that `.status` works in Kubernetes, you must create the
Service without a load balancer IP, and then add the IP as a second step:

```console
$ cat loadbalancer-service.yaml
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
$ kubectl apply -f loadbalancer-service.yaml
service/my-example-service created
$ kubectl patch service my-example-service --subresource=status --type=merge -p '{"status":{"loadBalancer":{"ingress":[{"ip":"192.0.2.4"}]}}}'
```

(Note that it is required to set the `loadBalancerClass` to the name of a non-existent
controller in order to ensure that no actual load balancer controller tries to manage
this service).


### Using a "bare metal" load balancer implementation

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

After which a user can create a load balancer Service and MetalLB will handle the
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
    app: my-example-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  loadBalancerIP: "192.0.2.4"
```

Similar approaches would work with other load balancer controllers.
This approach can allow cluster administrators to have control over which IP addresses are assigned,
rather than users.

### Using Gateway API

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
  hostnames:
  - "example.com"
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
    app: my-example-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

full-featured, future-proof, extensible, but requires the most changes
to existing services.

## Timeline for `externalIPs` deprecation

FIXME: Dan to make these words betterer

The rough timeline for this deprecation is as follows:

1. In Kubernetes 1.36 we start the deprecation and add warnings when a user uses this feature
2. Four releases later - support for externalIPs will be disabled in kube-proxy, but users can still opt-in should they require more time to migrate away
3. Three releases later - support will be disabled completely and users can't reeable it
