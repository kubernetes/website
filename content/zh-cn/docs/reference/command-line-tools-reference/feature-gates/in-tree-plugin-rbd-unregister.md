---
title: InTreePluginRBDUnregister
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.27"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.28"  
---

<!--
Stops registering the RBD in-tree plugin in kubelet
and volume controllers.
-->
在 kubelet 和卷控制器上关闭注册 RBD 内嵌插件。
