---
# Removed from Kubernetes
title: RunAsGroup
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.14"
    toVersion: "1.20"
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"

removed: true
---

<!--
Enable control over the primary group ID set on the init processes of containers.
-->
允许控制在容器初始化进程上设置的主组 ID。
