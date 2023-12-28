---
# Removed from Kubernetes
title: ScheduleDaemonSetPods
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.11"
    toVersion: "1.11"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.12"
    toVersion: "1.16"
  - stage: stable
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.18"

removed: true
---
<!--
Enable DaemonSet Pods to be scheduled by the default scheduler instead
of the DaemonSet controller.
-->
启用 DaemonSet Pod 由默认调度器而不是 DaemonSet 控制器进行调度。
