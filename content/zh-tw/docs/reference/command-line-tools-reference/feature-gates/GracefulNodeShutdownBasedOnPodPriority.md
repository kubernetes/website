---
title: GracefulNodeShutdownBasedOnPodPriority
content_type: feature_gate
_build:
  list: never
  render: false
  
stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.23"
  - stage: beta
    defaultValue: true
    fromVersion: "1.24"
---

<!--
Enables the kubelet to check Pod priorities
when shutting down a node gracefully.
-->
允許 kubelet 在體面終止節點時檢查 Pod 的優先級。
