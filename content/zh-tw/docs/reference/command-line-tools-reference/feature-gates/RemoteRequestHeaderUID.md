---
title: RemoteRequestHeaderUID
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.32"
---

<!--
Enable the API server to accept UIDs (user IDs) via request header authentication.
This will also make the `kube-apiserver`'s API aggregator add UIDs via standard headers when
forwarding requests to the servers serving the aggregated API.
-->
允許 API 服務器通過請求頭身份認證來接受 UID（用戶 ID）。
在 `kube-apiserver` 的 API 聚合器將請求轉發到提供聚合 API 的服務器時，
`kube-apiserver` 的 API 聚合器也將通過標準請求頭添加 UID。
