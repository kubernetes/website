---
title: KubeletPodResourcesListUseActivePods
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: stable
    defaultValue: false
    fromVersion: "1.0"
    toVersion: "1.33"
  - stage: deprecated
    defaultValue: true
    fromVersion: "1.34"
---
<!-- TODO: Add description for KubeletPodResourcesListUseActivePods feature gate -->
