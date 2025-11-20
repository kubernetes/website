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
    toVersion: "1.33"
  - stage: stable
    locked: true
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Add support for distributed tracing in the kubelet.
When enabled, kubelet CRI interface and authenticated http servers are instrumented to generate
OpenTelemetry trace spans.
See [Traces for Kubernetes System Components](/docs/concepts/cluster-administration/system-traces) for more details.
-->
新增在 kubelet 中對分佈式追蹤的支持。
啓用時，kubelet CRI 介面和經身份驗證的 http 伺服器被插樁以生成 OpenTelemetry 追蹤 Span。
詳情參見[追蹤 Kubernetes 系統組件](/zh-cn/docs/concepts/cluster-administration/system-traces/)。
