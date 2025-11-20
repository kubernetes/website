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
允許 API 伺服器在版本發現中公開儲存版本的哈希值。
