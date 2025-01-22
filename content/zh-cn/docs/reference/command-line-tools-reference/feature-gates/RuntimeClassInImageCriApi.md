---
title: RuntimeClassInImageCriApi
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.29"
---

<!--
Enables images to be pulled based on the [runtime class](/docs/concepts/containers/runtime-class/)
of the pods that reference them.
-->
允许基于 Pod 所引用的[运行时类](/zh-cn/docs/concepts/containers/runtime-class/)来拉取镜像。
