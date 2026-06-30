---
title: DownwardAPIAssignedResources
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Use `DownwardAPIAssignedResources` to control if kube-apiserver allows for mounting new fields in downwardAPI volume for container's CPU desired assignments.
