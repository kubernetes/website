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
允許使用 `/logs` 端點來查詢節點服務的日誌。
