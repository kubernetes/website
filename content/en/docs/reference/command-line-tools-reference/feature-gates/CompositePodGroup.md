---
title: CompositePodGroup
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Enable hierarchical gang scheduling for CompositePodGroups and PodGroups.
