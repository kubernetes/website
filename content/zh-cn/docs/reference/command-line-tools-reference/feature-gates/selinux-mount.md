---
title: SELinuxMount
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
---

<!--
Speeds up container startup by allowing kubelet to mount volumes
for a Pod directly with the correct SELinux label instead of changing each file on the volumes
recursively.
It widens the performance improvements behind the `SELinuxMountReadWriteOncePod`
feature gate by extending the implementation to all volumes.

Enabling the `SELinuxMount` feature gate requires the feature gate `SELinuxMountReadWriteOncePod` to
be enabled.
-->
允许 kubelet 直接使用正确的 SELinux 标签为 Pod 挂载卷，而不是以递归方式更改卷上的每个文件，进而加快容器的启动速度。
这一变更拓宽了针对 `SELinuxMountReadWriteOncePod` 特性门控所作的性能改进，将其对应的实现扩展到覆盖所有卷。

想要启用 `SELinuxMount` 特性门控，需先启用 `SELinuxMountReadWriteOncePod` 特性门控。
