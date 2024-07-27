---
title: VolumeCapacityPriority
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.21"
---

<!--
Enable support for prioritizing nodes in different
topologies based on available PV capacity.
-->
启用基于可用 PV 容量对不同拓扑域下节点进行优先级排序的支持。
