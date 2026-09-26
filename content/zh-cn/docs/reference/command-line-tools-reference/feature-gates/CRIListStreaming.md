---
title: CRIListStreaming
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---

<!--
Enable streaming RPCs for CRI list operations (`ListContainers`,
`ListPodSandbox`, `ListImages`). When enabled, the kubelet uses server-side
streaming RPCs (e.g., `StreamContainers`, `StreamPodSandboxes`) that allow the
container runtime to divide results across multiple response messages,
bypassing the 16 MiB gRPC message size limit. This allows listing containers
on nodes with thousands of containers without failures. If the container
runtime does not support streaming RPCs, the kubelet falls back to unary RPCs.
-->
为 CRI 列表操作（`ListContainers`、`ListPodSandbox`、`ListImages`）启用流式 RPC。
启用后，kubelet 使用服务器端流式 RPC（例如 `StreamContainers`、`StreamPodSandboxes`），
允许容器运行时将结果分散到多个响应消息中，绕过 16 MiB 的 gRPC 消息大小限制。
这允许在具有数千个容器的节点上列出容器而不会失败。
如果容器运行时不支持流式 RPC，kubelet 会回退到一元 RPC。
