---
title: NodeLogQuery
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.29"
  - stage: beta
    defaultValue: false
    fromVersion: "1.30"
---

<!--
Enables querying logs of node services using the `/logs` endpoint.
-->
允许使用 `/logs` 端点来查询节点服务的日志。
