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
---
Enable _Pod level resources_:  the ability to specify resource requests and limits
at the Pod level, rather than only for specific containers.