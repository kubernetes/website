---
title: GRPCContainerProbeTLS
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---

<!--
Enables TLS support for gRPC container probes. When enabled,
you can add the `mode` field to the `grpc` field in gRPC probes. Setting
`mode: TLS` on a liveness, readiness, or startup probe causes the kubelet
to connect over TLS (with `InsecureSkipVerify`).
See [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#grpc-probe-tls).
-->
为 gRPC 容器探针启用 TLS 支持。启用后，你可以在 gRPC 探针的 `grpc` 字段中添加 `mode` 字段。
在存活、就绪或启动探针上设置 `mode: TLS` 会使 kubelet 通过 TLS 连接（使用 `InsecureSkipVerify`）。
请参阅[配置存活、就绪和启动探针](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#grpc-probe-tls)。
