---
title: MemoryManager
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: beta
    defaultValue: true
    fromVersion: "1.22"
---
Allows setting memory affinity for a container based on
NUMA topology.
