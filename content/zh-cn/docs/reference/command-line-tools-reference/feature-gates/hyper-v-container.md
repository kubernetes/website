---
# Removed from Kubernetes
title: HyperVContainer
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.10"
    toVersion: "1.19"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.20"

removed: true
---

<!--
Enable
[Hyper-V isolation](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container)
for Windows containers.
-->
为 Windows 容器启用 [Hyper-V 隔离](https://docs.microsoft.com/zh-cn/virtualization/windowscontainers/manage-containers/hyperv-container)。
