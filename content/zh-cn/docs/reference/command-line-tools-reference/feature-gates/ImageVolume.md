---
title: ImageVolume
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.31"
---

<!--
Allow using the [`image`](/docs/concepts/storage/volumes/) volume source in a Pod.
This volume source lets you mount a container image as a read-only volume.
-->
允许在 Pod 中使用 [`image`](/zh-cn/docs/concepts/storage/volumes/) 卷源。
这个卷源允许你将容器镜像挂载为只读卷。
