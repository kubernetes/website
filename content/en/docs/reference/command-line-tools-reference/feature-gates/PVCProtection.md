---
# Removed from Kubernetes
title: PVCProtection
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.9"
    toVersion: "1.9"
  - stage: deprecated
    fromVersion: "1.10"
    toVersion: "1.10"

removed: true
---
Enable the prevention of a PersistentVolumeClaim (PVC) from
being deleted when it is still used by any Pod.
