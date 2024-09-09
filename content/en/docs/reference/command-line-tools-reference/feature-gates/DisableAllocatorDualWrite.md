---
title: DisableAllocatorDualWrite
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.31"
---
The API server may enable the `MultiCIDRServiceAllocator` feature in order to support live migration
from the old bitmap ClusterIP allocators to the new IPAddress allocators.
The API server performs a dual-write on both allocators. This feature gate disables the dual write
on the new Cluster IP allocators.

