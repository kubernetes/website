---
title: TopologyAwareHints
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.22"
  - stage: beta
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.23"
  - stage: beta
    defaultValue: true
    fromVersion: "1.24"
---

<!--
Enables topology aware routing based on topology hints
in EndpointSlices. See [Topology Aware
Hints](/docs/concepts/services-networking/topology-aware-routing/) for more
details.
-->
在 EndpointSlice 中启用基于拓扑提示的拓扑感知路由。
更多细节参见[拓扑感知路由](/zh-cn/docs/concepts/services-networking/topology-aware-routing/)。
