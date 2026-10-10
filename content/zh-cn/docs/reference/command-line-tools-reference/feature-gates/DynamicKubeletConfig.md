---
# Removed from Kubernetes
title: DynamicKubeletConfig
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.4"
    toVersion: "1.10"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.11"
    toVersion: "1.21"    
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.25"    

removed: true  
---
<!--
Enable the dynamic configuration of kubelet. The
feature is no longer supported outside of supported skew policy. The feature
gate was removed from kubelet in 1.24.
-->
启用 kubelet 的动态配置。
除偏差策略场景外，不再支持该功能。
该特性门控在 kubelet 1.24 版本中已被移除。
