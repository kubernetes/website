---
title: AggregatedDiscoveryEndpoint
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.29"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
---

<!--
Enable a single HTTP endpoint `/discovery/<version>` which
supports native HTTP caching with ETags containing all APIResources known to the API server.
-->
启用单个 HTTP 端点 `/discovery/<version>`，
支持用 ETag 进行原生 HTTP 缓存，包含 API 服务器已知的所有 APIResource。
