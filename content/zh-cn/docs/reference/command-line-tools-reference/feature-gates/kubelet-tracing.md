---
title: KubeletTracing
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
---

<!--
Add support for distributed tracing in the kubelet.
When enabled, kubelet CRI interface and authenticated http servers are instrumented to generate
OpenTelemetry trace spans.
See [Traces for Kubernetes System Components](/docs/concepts/cluster-administration/system-traces) for more details.
-->
新增在 kubelet 中对分布式追踪的支持。
启用时，kubelet CRI 接口和经身份验证的 http 服务器被插桩以生成 OpenTelemetry 追踪 span。
详情参见[追踪 Kubernetes 系统组件](/zh-cn/docs/concepts/cluster-administration/system-traces/)。
