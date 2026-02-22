---
# Removed from Kubernetes
title: CSIPersistentVolume
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.9"
    toVersion: "1.9"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.10"
    toVersion: "1.12"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.13"
    toVersion: "1.16"

removed: true  
---
<!--
Enable discovering and mounting volumes provisioned through a
[CSI (Container Storage Interface)](https://git.k8s.io/design-proposals-archive/storage/container-storage-interface.md)
compatible volume plugin.
-->
启用发现和挂载通过
[CSI（容器存储接口）](https://git.k8s.io/design-proposals-archive/storage/container-storage-interface.md)
兼容卷插件配置的卷。
