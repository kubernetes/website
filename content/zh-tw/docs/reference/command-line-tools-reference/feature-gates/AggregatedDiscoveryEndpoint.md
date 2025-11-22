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
    toVersion: "1.32"

removed: true
---

<!--
Enable a single HTTP endpoint `/discovery/<version>` which
supports native HTTP caching with ETags containing all APIResources known to the API server.
-->
啓用單個 HTTP 端點 `/discovery/<version>`，
支持用 ETag 進行原生 HTTP 緩存，包含 API 伺服器已知的所有 APIResource。
