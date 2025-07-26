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
Вмикає kubelet `checkpoint` API. Дивіться [Kubelet Checkpoint API](/docs/reference/node/kubelet-checkpoint-api/) для більш детальної інформації.
