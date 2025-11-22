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
啓用基於探針的插件監視程式，使 kubelet 能夠發現
[CSI 卷驅動程式](/zh-cn/docs/concepts/storage/volumes/#csi)這類插件。
