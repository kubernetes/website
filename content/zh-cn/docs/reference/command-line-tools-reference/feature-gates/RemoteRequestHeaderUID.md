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
允许 API 服务器通过请求头身份认证来接受 UID（用户 ID）。
在 `kube-apiserver` 的 API 聚合器将请求转发到提供聚合 API 的服务器时，
`kube-apiserver` 的 API 聚合器也将通过标准请求头添加 UID。
