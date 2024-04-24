---
title: SizeMemoryBackedVolumes
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.21"
  - stage: beta
    defaultValue: true
    fromVersion: "1.22"
---
<!--
Enable kubelets to determine the size limit for
memory-backed volumes (mainly `emptyDir` volumes).
-->
允许 kubelet 检查基于内存制备的卷的尺寸约束（目前主要针对 `emptyDir` 卷）。
