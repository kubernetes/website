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
API مربوط به kubelet `checkpoint` را فعال می‌کند. برای جزئیات بیشتر به [API Kubelet Checkpoint](/docs/reference/node/kubelet-checkpoint-api/) مراجعه کنید.