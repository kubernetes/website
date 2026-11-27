---
title: WorkloadControlledSwap
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Enables setting swap limits for containers and Pods with `resources.limits.swap`,
resizing those limits in place, and the `WorkloadControlledSwap` swap behavior for the kubelet.
For details, see [workload-controlled swap limits](/docs/concepts/cluster-administration/swap-memory-management/#workload-controlled-swap-limits).
