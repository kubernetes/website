---
title: TopologyAwareWorkloadScheduling
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
    toVersion: "1.37"
  - stage: beta
    defaultValue: false
    fromVersion: "1.38"
---
Enable topology-aware scheduling for Workloads.
