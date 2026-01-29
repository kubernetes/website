---
# Removed from Kubernetes
title: VolumeSubpathEnvExpansion
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.14"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.15"
    toVersion: "1.16"
  - stage: stable
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.24"

removed: true
---

<!--
Enable `subPathExpr` field for expanding environment
variables into a `subPath`.
-->
啓用 `subPathExpr` 字段用於在 `subPath` 中展開環境變量。
