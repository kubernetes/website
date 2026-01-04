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
    toVersion: "1.32"
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
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
允許 kubelet 直接使用正確的 SELinux 標籤爲 Pod 掛載卷，而不是以遞歸方式更改捲上的每個檔案，進而加快容器的啓動速度。
這一變更拓寬了針對 `SELinuxMountReadWriteOncePod` 特性門控所作的性能改進，將其對應的實現擴展到覆蓋所有卷。

想要啓用 `SELinuxMount` 特性門控，需先啓用 `SELinuxMountReadWriteOncePod` 特性門控。
