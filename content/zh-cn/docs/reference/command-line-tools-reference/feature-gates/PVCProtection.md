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

<!--
Enable the prevention of a PersistentVolumeClaim (PVC) from
being deleted when it is still used by any Pod.
-->
启用后，可预防仍然有 Pod 正使用的 PersistentVolumeClaim (PVC) 被删除。
