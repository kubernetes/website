---
title: InTreePluginPortworxUnregister
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
---

<!--
Stops registering the Portworx in-tree plugin in kubelet
and volume controllers.
-->
在 kubelet 和卷控制器上关闭注册 Portworx 内嵌插件。
