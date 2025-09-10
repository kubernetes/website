---
# Removed from Kubernetes
title: AllowExtTrafficLocalEndpoints
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: false
    fromVersion: "1.4"
    toVersion: "1.6"
  - stage: stable
    defaultValue: true
    fromVersion: "1.7"
    toVersion: "1.9"

removed: true
---

<!--
Enable a service to route external requests to node local endpoints.
-->
允许服务将外部请求路由到节点本地端点。
