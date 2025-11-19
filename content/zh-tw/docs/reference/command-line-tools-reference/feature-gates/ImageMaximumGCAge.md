---
title: ImageMaximumGCAge
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.29"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
---

<!--
Enables the kubelet configuration field `imageMaximumGCAge`, allowing an administrator to specify the age after which an image will be garbage collected.
-->
啓用 kubelet 配置字段 `imageMaximumGCAge`，允許管理員指定多久之後鏡像將被垃圾收集。
