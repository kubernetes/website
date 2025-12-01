---
title: ChangeContainerStatusOnKubeletRestart
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.35"
---
When disabled, kubelet restarts will not change the status of Pods already running on the node,
This Feature Gate was introduced to allow revert the behavior to previously used default.

