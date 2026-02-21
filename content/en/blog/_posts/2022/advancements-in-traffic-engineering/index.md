---
layout: blog
title: "Kubernetes v1.26: Advancements in Kubernetes Traffic Engineering"
date: 2022-12-30
slug: advancements-in-kubernetes-traffic-engineering
author: >
  Andrew Sy Kim (Google)
---

Kubernetes v1.26 includes significant advancements in network traffic engineering with the graduation of
two features (Service internal traffic policy support, and EndpointSlice terminating conditions) to GA,
and a third feature (Proxy terminating endpoints) to beta. The combination of these enhancements aims
to address short-comings in traffic engineering that people face today, and unlock new capabilities for the future.

## Traffic Loss from Load Balancers During Rolling Updates

Prior to Kubernetes v1.26, clusters could experience [loss of traffic](https://github.com/kubernetes/kubernetes/issues/85643)
from Service load balancers during rolling updates when setting the `externalTrafficPolicy` field to `Local`.
There are a lot of moving parts at play here so a quick overview of how Kubernetes manages load balancers might help!

In Kubernetes, you can create a Service with `type: LoadBalancer` to expose an application externally with a load balancer.
The load balancer implementation varies between clusters and platforms, but the Service provides a generic abstraction
representing the load balancer that is consistent across all Kubernetes installations.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  type: LoadBalancer
```

Under the hood, Kubernetes allocates a NodePort for the Service, which is then used by kube-proxy to provide a
network data path from the NodePort to the Pod. A controller will then add all available Nodes in the cluster
to the load balancer’s backend pool, using the designated NodePort for the Service as the backend target port.

{{< figure src="traffic-engineering-service-load-balancer.png" caption="Figure 1: Overview of Service load balancers" >}}

Oftentimes it is beneficial to set `externalTrafficPolicy: Local` for Services, to avoid extra hops between
Nodes that are not running healthy Pods backing that Service. When using `externalTrafficPolicy: Local`,
an additional NodePort is allocated for health checking purposes, such that Nodes that do not contain healthy
Pods are excluded from the backend pool for a load balancer.

{{< figure src="traffic-engineering-lb-healthy.png" caption="Figure 2: Load balancer traffic to a healthy Node, when externalTrafficPolicy is Local" >}}

One such scenario where traffic can be lost is when a Node loses all Pods for a Service,
but the external load balancer has not probed the health check NodePort yet. The likelihood of this situation
is largely dependent on the health checking interval configured on the load balancer. The larger the interval,
the more likely this will happen, since the load balancer will continue to send traffic to a node
even after kube-proxy has removed forwarding rules for that Service. This also occurrs when Pods start terminating
during rolling updates. Since Kubernetes does not consider terminating Pods as “Ready”, traffic can be loss
when there are only terminating Pods on any given Node during a rolling update.

{{< figure src="traffic-engineering-lb-without-proxy-terminating-endpoints.png" caption="Figure 3: Load balancer traffic to terminating endpoints, when externalTrafficPolicy is Local" >}}

Starting in Kubernetes v1.26, kube-proxy enables the `ProxyTerminatingEndpoints` feature by default, which
adds automatic failover and routing to terminating endpoints in scenarios where the traffic would otherwise
be dropped. More specifically, when there is a rolling update and a Node only contains terminating Pods,
kube-proxy will route traffic to the terminating Pods based on their readiness. In addition, kube-proxy will
actively fail the health check NodePort if there are only terminating Pods available. By doing so,
kube-proxy alerts the external load balancer that new connections should not be sent to that Node but will
gracefully handle requests for existing connections.

{{< figure src="traffic-engineering-lb-with-proxy-terminating-endpoints.png" caption="Figure 4: Load Balancer traffic to terminating endpoints with ProxyTerminatingEndpoints enabled, when externalTrafficPolicy is Local" >}}

### EndpointSlice Conditions

In order to support this new capability in kube-proxy, the EndpointSlice API introduced new conditions for endpoints:
`serving` and `terminating`.

{{< figure src="endpointslice-overview.png" caption="Figure 5: Overview of EndpointSlice conditions" >}}

The `serving` condition is semantically identical to `ready`, except that it can be `true` or `false`
while a Pod is terminating, unlike `ready` which will always be `false` for terminating Pods for compatibility reasons.
The `terminating` condition is true for Pods undergoing termination (non-empty deletionTimestamp), false otherwise.

The addition of these two conditions enables consumers of this API to understand Pod states that were previously not possible.
For example, we can now track "ready" and "not ready" Pods that are also terminating.

{{< figure src="endpointslice-with-terminating-pod.png" caption="Figure 6: EndpointSlice conditions with a terminating Pod" >}}

Consumers of the EndpointSlice API, such as Kube-proxy and Ingress Controllers, can now use these conditions to coordinate connection draining
events, by continuing to forward traffic for existing connections but rerouting new connections to other non-terminating endpoints.

## Optimizing Internal Node-Local Traffic

Similar to how Services can set `externalTrafficPolicy: Local` to avoid extra hops for externally sourced traffic, Kubernetes
now supports `internalTrafficPolicy: Local`, to enable the same optimization for traffic originating within the cluster, specifically
for traffic using the Service Cluster IP as the destination address. This feature graduated to Beta in Kubernetes v1.24 and is graduating to GA in v1.26.

Services default the `internalTrafficPolicy` field to `Cluster`, where traffic is randomly distributed to all endpoints.

{{< figure src="service-internal-traffic-policy-cluster.png" caption="Figure 7: Service routing when internalTrafficPolicy is Cluster" >}}

When `internalTrafficPolicy` is set to `Local`, kube-proxy will forward internal traffic for a Service only if there is an available endpoint
that is local to the same Node.

{{< figure src="service-internal-traffic-policy-local.png" caption="Figure 8: Service routing when internalTrafficPolicy is Local" >}}

{{< caution >}}
When using `internalTrafficPoliy: Local`, traffic will be dropped by kube-proxy when no local endpoints are available.
{{< /caution >}}

## Getting Involved

If you're interested in future discussions on Kubernetes traffic engineering, you can get involved in SIG Network through the following ways:
* Slack: [#sig-network](https://kubernetes.slack.com/messages/sig-network)
* [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-network)
* [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnetwork)
* [Biweekly meetings](https://github.com/kubernetes/community/tree/master/sig-network#meetings)
