---
title: ContainerCheckpoint
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.25"
---
Enables the kubelet `checkpoint` API.
See [Kubelet Checkpoint API](/docs/reference/node/kubelet-checkpoint-api/) for more details.
