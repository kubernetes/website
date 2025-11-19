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
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.33"
---

<!--
Enables topology aware routing based on topology hints
in EndpointSlices. See [Topology Aware
Hints](/docs/concepts/services-networking/topology-aware-routing/) for more
details.
-->
在 EndpointSlice 中啓用基於拓撲提示的拓撲感知路由。
更多細節參見[拓撲感知路由](/zh-cn/docs/concepts/services-networking/topology-aware-routing/)。
