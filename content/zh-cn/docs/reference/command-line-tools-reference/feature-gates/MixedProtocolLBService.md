---
title: MixedProtocolLBService
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.23"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.25"
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.27"

removed: true
---

<!--
Enable using different protocols in the same `LoadBalancer` type
Service instance.
-->
允许在同一 `LoadBalancer` 类型的 Service 实例中使用不同的协议。
