---
title: SELinuxMountReadWriteOncePod
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.26"
  - stage: beta
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.27"
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
---
<!--
Speeds up container startup by allowing kubelet to mount volumes
for a Pod directly with the correct SELinux label instead of changing each file on the volumes
recursively. The initial implementation focused on ReadWriteOncePod volumes.
-->
通过允许 kubelet 直接用正确的 SELinux
标签为 Pod 挂载卷而不是以递归方式更改这些卷上的每个文件来加速容器启动。
最初的实现侧重 ReadWriteOncePod 卷。
