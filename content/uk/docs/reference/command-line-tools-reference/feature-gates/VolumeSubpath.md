---
# Removed from Kubernetes
title: VolumeSubpath
content_type: feature_gate

build:
  list: never
  render: false

stages:
  - stage: stable
    defaultValue: true
    fromVersion: "1.10"
    toVersion: "1.24"

removed: true
---
Дозволяє монтувати субшлях тому в контейнері.
