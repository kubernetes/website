---
title: InTreePluginAWSUnregister
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.21"
---

<!--
Stops registering the aws-ebs in-tree plugin in kubelet
and volume controllers.
-->
在 kubelet 和卷控制器上关闭注册 aws-ebs 内嵌插件。
