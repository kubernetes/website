---
# Removed from Kubernetes
title: PodOverhead
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.16"
    toVersion: "1.17"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.23"
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.25"

removed: true
---

<!--
Enable the [PodOverhead](/docs/concepts/scheduling-eviction/pod-overhead/)
feature to account for pod overheads.
-->
启用 [PodOverhead](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/)
特性以计算 Pod 开销。
