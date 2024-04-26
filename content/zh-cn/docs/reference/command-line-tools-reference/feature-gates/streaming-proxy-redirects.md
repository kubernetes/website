---
# Removed from Kubernetes
title: StreamingProxyRedirects
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: false
    fromVersion: "1.5"
    toVersion: "1.5"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.6"
    toVersion: "1.17"    
  - stage: deprecated 
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.21"
  - stage: deprecated 
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.24"

removed: true
---
<!--
Instructs the API server to intercept (and follow) redirects from the
backend (kubelet) for streaming requests. Examples of streaming requests include the `exec`,
`attach` and `port-forward` requests.
-->
指示 API 服务器拦截（并跟踪）后端（kubelet）的重定向以处理流请求。
流请求的例子包括 `exec`、`attach` 和 `port-forward` 请求。
