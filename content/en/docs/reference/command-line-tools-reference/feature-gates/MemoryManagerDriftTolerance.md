---
title: MemoryManagerDriftTolerance
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Enables the `memory-drift-tolerance`
[policy option](/docs/tasks/administer-cluster/memory-manager/#policy-option-memory-drift-tolerance)
of the memory manager `Static` policy on Linux. With the option set, the kubelet
tolerates a bounded, benign change of the memory reported for a NUMA node across
a restart (for example after a reboot) instead of failing to start because the
persisted memory manager state no longer matches the machine exactly.
