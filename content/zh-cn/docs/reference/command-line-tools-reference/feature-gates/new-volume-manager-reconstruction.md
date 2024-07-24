---
title: NewVolumeManagerReconstruction
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.27"
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
    toVersion: "1.29"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
---

<!--
Enables improved discovery of mounted volumes during kubelet
startup. Since the associated code had been significantly refactored, Kubernetes versions 1.25 to 1.29
allowed you to opt-out in case the kubelet got stuck at the startup, or did not unmount volumes
from terminated Pods.
-->
在 kubelet 启动期间启用改进的挂载卷的发现。由于关联的代码已经进行了重大重构，
Kubernetes v1.25 到 v1.29 允许你不采用这一逻辑，以免 kubelet 在启动时被卡住，或者未能为已终止的 Pod 卸载卷。
请注意，此重构是作为 Kubernetes 1.25 中的 `SELinuxMountReadWriteOncePod` Alpha 特性门控的一部分完成的。

<!--
This refactoring was behind the `SELinuxMountReadWriteOncePod`  feature gate in Kubernetes
releases 1.25 and 1.26.
-->
在 Kubernetes v1.25 和 v1.26 中，此重构行为是 `SELinuxMountReadWriteOncePod` 特性门控的一部分。
