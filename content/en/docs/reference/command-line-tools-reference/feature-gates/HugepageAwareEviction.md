---
title: HugepageAwareEviction
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"

---
Enable the kubelet to subtract hugepage capacity from `memory.available`
so the eviction signal reflects actual regular-memory availability.
See [Node Pressure Eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/) for more details.
