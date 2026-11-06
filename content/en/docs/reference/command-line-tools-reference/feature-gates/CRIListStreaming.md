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
    toVersion: "1.37"
  - stage: beta
    defaultValue: true
    fromVersion: "1.38"
---
Enable streaming RPCs for CRI list operations (`ListContainers`,
`ListPodSandbox`, `ListImages`). When enabled, the kubelet uses server-side
streaming RPCs (e.g., `StreamContainers`, `StreamPodSandboxes`) that allow the
container runtime to divide results across multiple response messages,
keeping each message within the 16 MiB gRPC message size limit. This allows
listing containers on nodes with thousands of containers without failures.
If the container runtime does not support streaming RPCs, the kubelet falls
back to unary RPCs.
