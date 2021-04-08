---
reviewers:
- robscott
title: Topology Aware Hints
content_type: concept
weight: 45
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

_Topology Aware Hints_ enable topology aware routing by including suggestions
for how clients should consume endpoints. This approach adds metadata to enable
consumers of EndpointSlice and / or and Endpoints objects, so that traffic to
those network endpoints can be routed closer to where it originated.

For example, you can route traffic within a locality to reduce
costs, or to improve network performance.

<!-- body -->

## Motivation

Kubernetes clusters are increasingly deployed in multi-zone environments.
_Topology Aware Hints_ provides a mechanism to help keep traffic within the zone
it originated from. This concept is commonly referred to as "Topology Aware
Routing". When calculating the endpoints for a {{< glossary_tooltip term_id="Service" >}},
the EndpointSlice controller considers the topology (region and zone) of each endpoint
and populates the hints field to allocate it to a zone.
Cluster components such as the {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
can then consume those hints, and use them to influence how traffic to is routed
(favoring topologically closer endpoints).

## Using Topology Aware Hints

If you have [enabled](/docs/tasks/administer-cluster/enabling-topology-aware-hints) the
overall feature, you can activate Topology Aware Hints for a Service by setting the
`service.kubernetes.io/topology-aware-hints` annotation to `auto`. This tells
the EndpointSlice controller to set topology hints if it is deemed safe.
Importantly, this does not guarantee that hints will always be set.

## How it works {#implementation}

The functionality enabling this feature is split into two components: The
EndpointSlice controller and the kube-proxy. This section provides a high level overview
of how each component implements this feature.

### EndpointSlice controller {#implementation-control-plane}

The EndpointSlice controller is responsible for setting hints on EndpointSlices
when this feature is enabled. The controller allocates a proportional amount of
endpoints to each zone. This proportion is based on the
[allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
CPU cores for nodes running in that zone. For example, if one zone had 2 CPU
cores and another zone only had 1 CPU core, the controller would allocated twice
as many endpoints to the zone with 2 CPU cores.

The following example shows what an EndpointSlice looks like when hints have
been populated:

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: example-hints
  labels:
    kubernetes.io/service-name: example-svc
addressType: IPv4
ports:
  - name: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
      - "10.1.2.3"
    conditions:
      ready: true
    hostname: pod-1
    zone: zone-a
    hints:
      forZones:
        - name: "zone-a"
```

### kube-proxy {#implementation-kube-proxy}

The kube-proxy component filters the endpoints it routes to based on the hints set by
the EndpointSlice controller. In most cases, this means that the kube-proxy is able
to route traffic to endpoints in the same zone. Sometimes the controller allocates endpoints
from a different zone to ensure more even distribution of endpoints between zones.
This would result in some traffic being routed to other zones.

## Safeguards

The Kubernetes control plane and the kube-proxy on each node apply some
safeguard rules before using Topology Aware Hints. If these don't check out,
the kube-proxy selects endpoints from anywhere in your cluster, regardless of the
zone.

1. **Insufficient number of endpoints:** If there are less endpoints than zones
   in a cluster, the controller will not assign any hints.

2. **Impossible to achieve balanced allocation:** In some cases, it will be
   impossible to achieve a balanced allocation of endpoints among zones. For
   example, if zone-a is twice as large as zone-b, but there are only 2
   endpoints, an endpoint allocated to zone-a may receive twice as much traffic
   as zone-b. The controller does not assign hints if it can't get this "expected
   overload" value below an acceptable threshold for each zone. Importantly this
   is not based on real-time feedback. It is still possible for individual
   endpoints to become overloaded.

3. **One or more Nodes has insufficient information:** If any node does not have
   a `topology.kubernetes.io/zone` label or is not reporting a value for
   allocatable CPU, the control plane does not set any topology-aware endpoint
   hints and so kube-proxy does not filter endpoints by zone.

4. **One or more endpoints does not have a zone hint:** When this happens,
   the kube-proxy assumes that a transition from or to Topology Aware Hints is
   underway. Filtering endpoints for a Service in this state would be dangerous
   so the kube-proxy falls back to using all endpoints.

5. **A zone is not represented in hints:** If the kube-proxy is unable to find
   at least one endpoint with a hint targeting the zone it is running in, it falls
   to using endpoints from all zones. This is most likely to happen as you add
   a new zone into your existing cluster.

## Constraints

* Topology Aware Hints are not used when either `externalTrafficPolicy` or
  `internalTrafficPolicy` is set to `Local` on a Service. It is possible to use
  both features in the same cluster on different Services, just not on the same
  Service.

* This approach will not work well for Services that have a large proportion of
  traffic originating from a subset of zones. Instead this assumes that incoming
  traffic will be roughly proportional to the capacity of the Nodes in each
  zone.

* The EndpointSlice controller ignores unready nodes as it calculates the
  proportions of each zone. This could have unintended consequences if a large
  portion of nodes are unready.

* The EndpointSlice controller does not take into account {{< glossary_tooltip
  text="tolerations" term_id="toleration" >}} when deploying calculating the
  proportions of each zone. If the Pods backing a Service are limited to a
  subset of Nodes in the cluster, this will not be taken into account.

* This may not work well with autoscaling. For example, if a lot of traffic is
  originating from a single zone, only the endpoints allocated to that zone will
  be handling that traffic. That could result in {{< glossary_tooltip
  text="Horizontal Pod Autoscaler" term_id="horizontal-pod-autoscaler" >}}
  either not picking up on this event, or newly added pods starting in a
  different zone.

## {{% heading "whatsnext" %}}

* Read about [enabling Topology Aware Hints](/docs/tasks/administer-cluster/enabling-topology-aware-hints/)
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
