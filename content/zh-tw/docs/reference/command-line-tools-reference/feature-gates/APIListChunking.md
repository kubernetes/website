---
title: APIListChunking
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.8"
    toVersion: "1.8"
  - stage: beta
    defaultValue: true
    fromVersion: "1.9"
    toVersion: "1.28"
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.32"

removed: true
---

<!--
Enable the API clients to retrieve (`LIST` or `GET`)
resources from API server in chunks.
-->
允許 API 客戶端以塊的形式從 API 服務器檢索（`LIST` 或 `GET`）資源。
