---
# Removed from Kubernetes
title: CSIMigrationAWS
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
    defaultValue: false
    fromVersion: "1.17"
    toVersion: "1.22"    
  - stage: beta 
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.24"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.26"    

removed: true
---
<!--
Enables shims and translation logic to route volume
operations from the AWS-EBS in-tree plugin to EBS CSI plugin. Supports
falling back to in-tree EBS plugin for mount operations to nodes that have
the feature disabled or that do not have EBS CSI plugin installed and
configured. Does not support falling back for provision operations, for those
the CSI plugin must be installed and configured.
-->
啓用封裝和轉換邏輯，將卷操作從 AWS-EBS 內嵌插件路由到 EBS CSI 插件。
如果節點禁用了此特性門控或者未安裝和配置 EBS CSI 插件，支持回退到內嵌 EBS 插件來執行卷掛載操作。
不支持回退到這些插件來執行卷製備操作，因爲需要安裝並配置 CSI 插件
