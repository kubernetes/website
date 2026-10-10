---
title: StaleControllerConsistencyStatefulSet
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---

<!--
Enables behavior within the StatefulSet controller to ensure that prior writes to
the API server are observed before proceeding with additional reconciliation for the same StatefulSet.
This is to prevent stale cache from causing incorrect or spurious updates to the StatefulSet.
-->
启用 StatefulSet 控制器中的相应行为，以确保在对同一 StatefulSet 进行额外协调之前，
先观察之前对 API 服务器的写入操作。
这样做是为了防止过期的缓存导致对 StatefulSet 的错误或虚假更新。

