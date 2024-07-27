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
---

<!--
Enable the API clients to retrieve (`LIST` or `GET`)
resources from API server in chunks.
-->
允许 API 客户端以块的形式从 API 服务器检索（`LIST` 或 `GET`）资源。
