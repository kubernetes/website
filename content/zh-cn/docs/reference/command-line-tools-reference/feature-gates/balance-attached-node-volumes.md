---
# Removed from Kubernetes
title: BalanceAttachedNodeVolumes
content_type: feature_gate

_build:
  list: never
  render: false
---

<!--
Include volume count on node to be considered for
balanced resource allocation while scheduling. A node which has closer CPU,
memory utilization, and volume count is favored by the scheduler while making decisions.
-->
在进行平衡资源分配的调度时，考虑节点上的卷数。
调度器在决策时会优先考虑 CPU、内存利用率和卷数更近的节点。
  