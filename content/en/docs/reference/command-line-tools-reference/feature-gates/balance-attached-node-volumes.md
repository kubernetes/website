---
# Removed from Kubernetes
title: BalanceAttachedNodeVolumes
content_type: feature_gate

_build:
  list: never
  render: false
---
Include volume count on node to be considered for
balanced resource allocation while scheduling. A node which has closer CPU,
memory utilization, and volume count is favored by the scheduler while making decisions.
