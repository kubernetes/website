---
title: NodeSystemPartition
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"

---
Enable administrators to create a dedicated, resource-isolated partition for
system Pods (such as kube-system workloads) with its own memory limits and CPU
set, preventing them from interfering with user workloads and ensuring critical
system components have guaranteed resources.
