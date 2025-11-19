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
    toVersion: "1.32"

removed: true
---

<!--
Enable support for prioritizing nodes in different
topologies based on available PV capacity.
-->
啓用基於可用 PV 容量對不同拓撲域下節點進行優先級排序的支持。
