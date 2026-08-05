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
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
---

<!--
The split image filesystem feature enables kubelet to perform garbage collection
of images (read-only layers) and/or containers (writeable layers) deployed on
separate filesystems.
-->
分离镜像文件系统特性使 kubelet 能够对部署在不同文件系统上的镜像（只读层）和/或容器（可写层）执行垃圾回收。
