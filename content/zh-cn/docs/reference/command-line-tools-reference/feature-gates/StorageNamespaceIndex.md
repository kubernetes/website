---
title: StorageNamespaceIndex
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.30"
---

<!--
Enables a namespace indexer for namespace scoped resources
in API server cache to accelerate list operations.
-->
为 API 服务器缓存中作用域为命名空间的资源启用命名空间索引器，以加速 list 操作。
