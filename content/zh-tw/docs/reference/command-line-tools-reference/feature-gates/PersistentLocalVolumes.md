---
# Removed from Kubernetes
title: PersistentLocalVolumes
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.7"
    toVersion: "1.9"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.10"
    toVersion: "1.13"
  - stage: stable
    defaultValue: true
    fromVersion: "1.14"
    toVersion: "1.16"

removed: true
---

<!--
Enable the usage of `local` volume type in Pods.
Pod affinity has to be specified if requesting a `local` volume.
-->
允許在 Pod 中使用 `local` 卷類型。
如果請求 `local` 卷，則必須指定 Pod 親和性屬性。
