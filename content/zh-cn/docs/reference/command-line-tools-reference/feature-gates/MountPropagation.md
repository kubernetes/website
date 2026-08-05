---
# Removed from Kubernetes
title: MountPropagation
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.8"
    toVersion: "1.9"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.10"
    toVersion: "1.11"
  - stage: stable
    defaultValue: true
    fromVersion: "1.12"
    toVersion: "1.14"

removed: true
---

<!--
Enable sharing volume mounted by one container to other containers or pods.
For more details, please see [mount propagation](/docs/concepts/storage/volumes/#mount-propagation).
-->
允许将一个容器上挂载的卷共享到其他容器或 Pod。
更多详细信息，请参见[挂载传播](/zh-cn/docs/concepts/storage/volumes/#mount-propagation)。
