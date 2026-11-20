---
title: WindowsCPUAndMemoryAffinity
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.37"
  - stage: beta
    defaultValue: true
    fromVersion: "1.38"
---

Add CPU and Memory Affinity support to Windows nodes with [CPUManager](/docs/tasks/administer-cluster/cpu-management-policies/#windows-support),
[MemoryManager](/docs/tasks/administer-cluster/memory-manager/#windows-support)
and [Topology Manager](/docs/tasks/administer-cluster/topology-manager/#windows-support).
