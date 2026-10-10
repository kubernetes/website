---
title: RemoveSelfLink
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.16"
    toVersion: "1.19"
  - stage: beta
    defaultValue: true
    fromVersion: "1.20"  
    toVersion: "1.23" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"  
    toVersion: "1.29"

removed: true
---

<!--
Sets the `.metadata.selfLink` field to blank (empty string) for all
objects and collections. This field has been deprecated since the Kubernetes v1.16
release. When this feature is enabled, the `.metadata.selfLink` field remains part of
the Kubernetes API, but is always unset.
-->
为所有对象和集合将 `.metadata.selfLink` 字段设置为空（空字符串）。
此字段自 Kubernetes v1.16 版本以来已被弃用。
当此特性被启用时，`.metadata.selfLink` 字段仍然是 Kubernetes API 的一部分，但始终不设置。
