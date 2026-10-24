---
title: PodsAPI
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
    toVersion: "1.36"
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
Вмикає службу gRPC Pods API kubelet. Докладні відомості див. у [kubelet Pods API](/docs/reference/node/kubelet-pods-api/).
