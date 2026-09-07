---
title: ImageVolumeWithDigest
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
  
<!--
For each [`image` volume](/docs/concepts/storage/volumes#image) in a Pod,
image digest as part of the pod's status.
-->
对于 Pod 中的每个 [`image` 卷](/zh-cn/docs/concepts/storage/volumes#image)，
都会将镜像摘要（image digest）记录到 Pod 状态中。
