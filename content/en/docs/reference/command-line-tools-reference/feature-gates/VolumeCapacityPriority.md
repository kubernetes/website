---
title: VolumeCapacityPriority
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.32"

removed: true
---
Enable support for prioritizing nodes in different
topologies based on available PV capacity.
This feature is renamed to `StorageCapacityScoring` in v1.33.
