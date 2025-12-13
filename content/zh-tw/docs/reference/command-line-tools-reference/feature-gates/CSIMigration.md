---
# Removed from Kubernetes
title: CSIMigration
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.16"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.24"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.26"    

removed: true
---
<!--
Enables shims and translation logic to route volume
operations from in-tree plugins to corresponding pre-installed CSI plugins
-->
啓用封裝和轉換邏輯，將卷操作從內嵌插件路由到對應的預安裝 CSI 插件。
