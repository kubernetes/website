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
    toVersion: "1.29"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
---
Enables the kubelet `checkpoint` API.
See [Kubelet Checkpoint API](/docs/reference/node/kubelet-checkpoint-api/) for more details.
