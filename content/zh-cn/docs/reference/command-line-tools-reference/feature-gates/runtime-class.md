---
# Removed from Kubernetes
title: RuntimeClass
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
    toVersion: "1.19"
  - stage: stable
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.24"

removed: true
---

<!--
Enable the [RuntimeClass](/docs/concepts/containers/runtime-class/) feature for
selecting container runtime configurations.
-->
启用 [RuntimeClass](/zh-cn/docs/concepts/containers/runtime-class/)特性，
用于选择容器运行时配置。
