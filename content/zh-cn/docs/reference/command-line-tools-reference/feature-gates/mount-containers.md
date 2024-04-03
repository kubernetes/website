---
# Removed from Kubernetes
title: MountContainers
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.9"
    toVersion: "1.16"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.17"
    toVersion: "1.17"

removed: true
---

<!--
Enable using utility containers on host as the volume mounter.
-->
允许使用主机上的工具容器作为卷挂载程序。
