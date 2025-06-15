---
title: OrderedNamespaceDeletion
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---

<!--
Enables the pods being deleted before the rest of resources while namespace deletion.
-->
允许在删除命名空间时，先删除 Pod，再删除其他资源。
