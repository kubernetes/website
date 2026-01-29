---
# Removed from Kubernetes
title: BalanceAttachedNodeVolumes
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.11"
    toVersion: "1.21"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.22"

removed: true
---

<!--
Include volume count on node to be considered for
balanced resource allocation while scheduling. A node which has closer CPU,
memory utilization, and volume count is favored by the scheduler while making decisions.
-->
在調度時考慮節點上的卷數量，以實現平衡資源分配。
調度器在決策時會優先考慮 CPU、內存利用率和卷數更近的節點。
