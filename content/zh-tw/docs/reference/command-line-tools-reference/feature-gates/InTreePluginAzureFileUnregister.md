---
title: InTreePluginAzureFileUnregister
content_type: feature_gate
_build:
  list: never
  render: false
 
stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.21" 
    toVersion: "1.30"

removed: true
---

<!--
Stops registering the azurefile in-tree plugin in kubelet
and volume controllers.
-->
在 kubelet 和卷控制器上關閉註冊 azurefile 內嵌插件。
