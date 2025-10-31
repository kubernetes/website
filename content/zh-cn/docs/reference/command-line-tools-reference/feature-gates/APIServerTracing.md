---
title: APIServerTracing
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"  
---

<!--
Add support for distributed tracing in the API server.
See [Traces for Kubernetes System Components](/docs/concepts/cluster-administration/system-traces) for more details.
-->
在 API 服务器中添加对分布式跟踪的支持。
更多细节参阅[针对 Kubernetes 系统组件的追踪](/zh-cn/docs/concepts/cluster-administration/system-traces/)。
