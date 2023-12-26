---
# Removed from Kubernetes
title: GCERegionalPersistentDisk
content_type: feature_gate

_build:
  list: never
  render: false

stages:
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
Enable the regional PD feature on GCE.
-->
在 GCE 上启用带地理区域信息的 PD 特性。
