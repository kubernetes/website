---
title: KubeletSeparateDiskGC
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.29"
---

<!--
Enable kubelet to garbage collect container images and containers
even when those are on a separate filesystem.
-->
启用 kubelet，即使在容器镜像和容器位于独立文件系统的情况下，也能进行垃圾回收。
