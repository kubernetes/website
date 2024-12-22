---
# Removed from Kubernetes
title: VolumeSubpath
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: stable
    defaultValue: true
    fromVersion: "1.10"
    toVersion: "1.24"

removed: true
---
Allow mounting a subpath of a volume in a container.
