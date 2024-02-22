---
reviewers:
- gauravkg
title: Service Traffic Distribution
content_type: concept
weight: 130
description: >-
  The `spec.trafficDistribution` field within a Kubernetes Service allows you to
  express routing preferences for service endpoints. This can optimize network
  traffic patterns for performance, cost, or reliability.
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.30" state="alpha" >}}

The `spec.trafficDistribution` field within a Kubernetes Service allows you to
express preferences for how traffic should be routed to Service endpoints. This
field acts as a hint, and implementations, while encouraged to consider the
preference, are not strictly bound by it.

<!-- body -->

## Using Service Traffic Distribution

You can influence how a Kubernetes Service routes traffic by setting the
optional `.spec.trafficDistribution` field. Currently, the following value is
supported:

* `PreferClose`: Indicates a preference for routing traffic to endpoints that
  are topologically proximate to the client. The interpretation of
  "topologically proximate" may vary across implementations and could encompass
  endpoints within the same node, rack, zone, or even region. Setting this value
  gives implementations permission to make different tradeoffs, e.g. optimizing
  for proximity rather than equal distribution of load. Users should not set
  this value if such tradeoffs are not acceptable.

If the field is not set, the implementation will apply its default routing strategy.

## How it Works

Implementations like kube-proxy use the `spec.trafficDistribution` field as a
guideline. The behavior associated with a given preference may subtly differ
between implementations.

* `PreferClose` with kube-proxy: For kube-proxy, this means prioritizing
  endpoints within the same zone as the client. The EndpointSlice controller
  updates EndpointSlices with hints to communicate this preference, which
  kube-proxy then uses for routing decisions. If a client's zone does not have
  any available endpoints, traffic will be routed cluster-wide for that client.

In the absence of any value for `trafficDistribution`, the default routing
strategy for kube-proxy is to distribute traffic to any endpoint in the cluster.

### Comparison with `service.kubernetes.io/topology-mode=Auto`

The `trafficDistribution` field with `PreferClose` shares a common goal of
prioritizing same-zone traffic with `service.kubernetes.io/topology-mode=Auto`
annotation. However, there are key differences in their approaches:

* `service.kubernetes.io/topology-mode=Auto`: Attempts to distribute traffic
  proportionally across zones based on allocatable CPU resources. This heuristic
  includes safeguards (like
  [these]((docs/concepts/services-networking/topology-aware-routing/#three-or-more-endpoints-per-zone)))
  and could lead to the feature being disabled in certain scenarios for
  load-balancing reasons. This approach sacrifices some predictability in favor
  of potential load balancing.

* `trafficDistribution: PreferClose`: This approach aims to be slightly simpler
  and more predictable: "If there are endpoints in the zone, they will receive
  all traffic for that zone, if there are no endpoints in a zone, the traffic
  will be distributed to other zones". While the approach may offer more
  predictability, it does mean that the customer is in control of managing a
  [potential overload](#important-considerations).

If the `service.kubernetes.io/topology-mode` annotation is set to `Auto`, it
will take precedence over `trafficDistribution`. (The annotation may be deprecated
in the future in favour of the `trafficDistribution` field)

### Interaction with `externalTrafficPolicy` and `internalTrafficPolicy`

When compared to the `trafficDistribution` field, the traffic policy fields are
meant to offer a stricter traffic locality requirements. Here's how
`trafficDistribution` interacts with them:

* Precedence of Traffic Policies: If either `externalTrafficPolicy` or
  `internalTrafficPolicy` is set to `Local`, it takes precedence over
  `trafficDistribution: PreferClose`. Here's how this behavior impacts traffic
  routing:

    * `internalTrafficPolicy: Local`: Traffic is restricted to endpoints on
      the same node as the originating pod. If no node-local endpoints exist,
      the traffic is dropped.

    * `externalTrafficPolicy: Local`: Traffic originating outside the cluster
      is routed to a node-local endpoint to preserve the client source IP. If no
      node-local endpoints exist, the kube-proxy does not forward any traffic
      for the relevant Service.

* `trafficDistribution` Influence: If either `externalTrafficPolicy` or
  `internalTrafficPolicy` is set to `Cluster` (the default), or if these fields
  are not set, then `trafficDistribution: PreferClose` guides the routing
  behavior. This means that an attempt will be made to route traffic to an
  endpoint that is topologically proximate to the client.

## Important Considerations

* Potential Overload: The PreferClose preference might increase the risk of
  endpoint overload in certain zones if traffic patterns within a zone are
  heavily skewed. To mitigate this, consider the following strategies:

    * [Pod Topology Spread
      Constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/):
      Use Pod Topology Spread Constraints to distribute your pods more evenly
      across zones.

    * Zone-Specific Deployments: If traffic skew is expected, create separate
      deployments per zone, allowing for independent scaling.

* Preferences, Not Guarantees: The `trafficDistribution` field provides hints to
  influence routing, but it does not enforce strict behavior.

**What's Next**

* Explore [Topology Aware Routing](/docs/concepts/services-networking/topology-aware-routing) for related concepts.
* Read about [Service Internal Traffic Policy](/docs/concepts/services-networking/service-traffic-policy.md)
* Read about [Service External Traffic Policy](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
