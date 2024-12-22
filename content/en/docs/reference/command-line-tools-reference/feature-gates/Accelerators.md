---
# Removed from Kubernetes
title: Accelerators
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.6"
    toVersion: "1.10"
  - stage: deprecated
    fromVersion: "1.11"
    toVersion: "1.11"

removed: true
---
Provided an early form of plugin to enable Nvidia GPU support when using
Docker Engine; no longer available. See
[Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) for
an alternative.
