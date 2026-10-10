---
# Removed from Kubernetes
title: MountPropagation
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.8"
    toVersion: "1.9"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.10"
    toVersion: "1.11"
  - stage: stable
    defaultValue: true
    fromVersion: "1.12"
    toVersion: "1.14"

removed: true
---
Enable sharing volume mounted by one container to other containers or pods.
For more details, please see [mount propagation](/docs/concepts/storage/volumes/#mount-propagation).
