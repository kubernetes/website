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
通過允許 kubelet 直接用正確的 SELinux
標籤爲 Pod 掛載卷而不是以遞歸方式更改這些捲上的每個文件來加速容器啓動。
最初的實現側重 ReadWriteOncePod 卷。
