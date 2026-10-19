---
# Removed from Kubernetes
title: KubeletPluginsWatcher
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
    toVersion: "1.12"
  - stage: stable
    defaultValue: true
    fromVersion: "1.13"
    toVersion: "1.16"

removed: true
---

<!--
Enable probe-based plugin watcher utility to enable kubelet
to discover plugins such as [CSI volume drivers](/docs/concepts/storage/volumes/#csi).
-->
启用基于探针的插件监视程序，使 kubelet 能够发现
[CSI 卷驱动程序](/zh-cn/docs/concepts/storage/volumes/#csi)这类插件。
