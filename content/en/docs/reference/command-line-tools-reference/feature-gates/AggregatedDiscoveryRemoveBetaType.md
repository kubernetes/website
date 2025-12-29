---
title: AggregatedDiscoveryRemoveBetaType
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: stable
    defaultValue: false
    fromVersion: "1.0"
    toVersion: "1.32"
  - stage: deprecated
    defaultValue: true
    fromVersion: "1.33"
    toVersion: "1.34"
  - stage: deprecated
    defaultValue: true
    fromVersion: "1.35"
    locked: true
---
<!-- TODO: Add description for AggregatedDiscoveryRemoveBetaType feature gate -->
