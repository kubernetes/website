---
title: StorageVersionHash
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
---
<!--
Allow API servers to expose the storage version hash in the
discovery.
-->
允许 API 服务器在版本发现中公开存储版本的哈希值。
