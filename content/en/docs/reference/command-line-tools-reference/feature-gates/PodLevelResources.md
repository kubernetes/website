---
title: PodLevelResources
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
    toVersion: "1.37"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.38"
---
Enable _Pod level resources_: the ability to specify resource requests and limits
at the Pod level, rather than only for specific containers.
