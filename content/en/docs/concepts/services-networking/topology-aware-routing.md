---
reviewers:
- robscott
title: Topology Aware Routing
content_type: concept
weight: 100
description: >-
  _Topology Aware Routing_ is a feature that helps keep network traffic close to
  where it originated. Preferring topologically closer endpoints for Pods in your
  cluster can help with reliability, performance (network latency and
  throughput), or cost.
---


<!-- overview -->

{{< note >}}
Prior to Kubernetes 1.27, this feature was known as _Topology Aware Hints_.
{{</ note >}}

You can enable _Topology Aware Routing_ in one of two ways:

* The [`spec.trafficDistribution`](#traffic-distribution) field (recommended).
* The [`service.kubernetes.io/topology-mode`](#topology-mode-annotation)
  annotation (legacy).

<!-- body -->

## Why use Topology Aware Routing

Kubernetes clusters are increasingly deployed in multi-zone environments.
Topology Aware Routing provides a mechanism to help keep traffic close to
where it originated. When calculating the endpoints for a {{< glossary_tooltip
term_id="Service" >}}, the EndpointSlice controller considers the topology
(region and zone) of each endpoint and populates the `hints` field to indicate
which zone (or node) should consume it. Cluster components such as
{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}} can then consume
those hints, and use them to influence how the traffic is routed (favoring
topologically closer endpoints).

## How it works

Topology Aware Routing is implemented by two cluster components working together.
This is true regardless of which mechanism you use to configure it (the
`trafficDistribution` field or the `topology-mode` annotation); the mechanism
only changes how the hints are decided.

### EndpointSlice controller {#implementation-control-plane}

The EndpointSlice controller is responsible for setting hints on EndpointSlices.
Based on the topology of each endpoint (its region and zone) and the routing
preference in effect, the controller populates a `hints` field on each endpoint
indicating which zone (or node) it should serve.

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
      forNodes:
        - name: "node-1"
```

### kube-proxy {#implementation-kube-proxy}

The kube-proxy component filters the endpoints it routes to based on the hints
set by the EndpointSlice controller. In most cases, this means that kube-proxy is
able to route traffic to endpoints that are topologically close, for example in
the same zone. When no suitable local endpoints are available, kube-proxy falls
back to routing across the wider cluster.

## Enabling Topology Aware Routing

There are two ways to express a topology-aware routing preference for a Service:

* The [`spec.trafficDistribution`](#traffic-distribution) field is the
  recommended approach, and has been generally available since Kubernetes v1.33.
* The [`service.kubernetes.io/topology-mode`](#topology-mode-annotation)
  annotation is an older approach and is expected to be deprecated in favor of
  the field.

If the `service.kubernetes.io/topology-mode` annotation is set to `Auto`, it
will take precedence over `trafficDistribution`.

### The trafficDistribution field {#traffic-distribution}

{{< feature-state for_k8s_version="v1.33" state="stable" >}}

Set the `spec.trafficDistribution` field on a
{{< glossary_tooltip term_id="Service" >}} to express a preference for how
traffic should be routed, for example
`PreferSameZone` to keep traffic within the client's zone, or `PreferSameNode` to
prefer the client's node. This is the recommended way to use Topology Aware
Routing.

For more details and comparison with the topology-mode annotation method, see
[Traffic distribution control](/docs/reference/networking/virtual-ips/#traffic-distribution).

### The topology-mode annotation {#topology-mode-annotation}

Setting the `service.kubernetes.io/topology-mode` annotation to `Auto` enables an
older heuristic: the EndpointSlice controller calculates each zone's share of the
total allocatable CPU, and uses those proportions as the target for how much
traffic each zone should receive. It then sets `forZones` hints on endpoints so
that kube-proxy keeps traffic within the client's zone.

The `Auto` heuristic has several limitations:

* **Requires enough endpoints per zone.** The heuristic works well only with
  roughly 3 or more endpoints per zone. With fewer endpoints than zones, or no
  balanced allocation, it sets no hints and kube-proxy routes cluster-wide.

* **Assumes traffic tracks zone capacity.** It assumes traffic is roughly
  proportional to each zone's allocatable CPU. Traffic concentrated in one zone
  can overload that zone's endpoints, and it interacts poorly with autoscaling: a
  {{< glossary_tooltip text="HorizontalPodAutoscaler" term_id="horizontal-pod-autoscaler" >}}
  may miss the load, or new Pods may start in another zone.

* **Sensitive to node information.** No hints are set if any node lacks the
  `topology.kubernetes.io/zone` label or an allocatable CPU value. Not-ready
  nodes, control plane nodes, and Pod
  {{< glossary_tooltip text="tolerations" term_id="toleration" >}} are ignored
  when computing proportions, which can skew results.

* **Transitions fall back.** During changes such as adding a zone, kube-proxy may
  route across all zones until hints are populated.

* **Incompatible with `internalTrafficPolicy: Local`.** Topology Aware Routing
  hints are ignored on a Service that sets `internalTrafficPolicy: Local`,
  although you can still use each feature on different Services in the same
  cluster.

## {{% heading "whatsnext" %}}

* Follow the [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/)
  tutorial.
* Read more about the [`trafficDistribution`](/docs/concepts/services-networking/service/#traffic-distribution)
  field in the Service documentation.
