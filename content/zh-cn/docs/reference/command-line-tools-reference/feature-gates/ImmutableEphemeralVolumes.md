---
# Removed from Kubernetes
title: ImmutableEphemeralVolumes
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.18"
    toVersion: "1.18"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.20"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.24"    

removed: true
---

<!--
Allows for marking individual Secrets and ConfigMaps as
immutable for better safety and performance.
-->
允许将各个 Secret 和 ConfigMap 标记为不可变更的，以提高安全性和性能。
