---
# Removed from Kubernetes
title: DynamicVolumeProvisioning
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: true
    fromVersion: "1.3"
    toVersion: "1.7"
  - stage: stable
    defaultValue: true
    fromVersion: "1.8"
    toVersion: "1.12"    

removed: true 
---
<!--
Enable the
[dynamic provisioning](/docs/concepts/storage/dynamic-provisioning/) of persistent volumes to Pods.
-->
启用持久化卷到 Pod
的[动态制备](/zh-cn/docs/concepts/storage/dynamic-provisioning/)。
