---
# Removed from Kubernetes
title: CSINodeInfo
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.12"
    toVersion: "1.13"
  - stage: beta
    defaultValue: true
    fromVersion: "1.14"
    toVersion: "1.16"
  - stage: stable
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.22"

removed: true
---
Вмикає всю логіку, повʼязану з обʼєктом API CSINodeInfo в `csi.storage.k8s.io`.
