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
---

<!--
Enables improved discovery of mounted volumes during kubelet
startup. Since this code has been significantly refactored, we allow to opt-out in case kubelet
gets stuck at the startup or is not unmounting volumes from terminated Pods. Note that this
refactoring was behind `SELinuxMountReadWriteOncePod` alpha feature gate in Kubernetes 1.25.
-->
在 kubelet 启动期间启用改进的挂载卷的发现。由于这段代码已经进行了重大重构，
我们允许用户不采用这一逻辑，以免 kubelet 在启动时被卡住，或者未能为已终止的 Pod 卸载卷。
请注意，此重构是作为 Kubernetes 1.25 中的 `SELinuxMountReadWriteOncePod` Alpha 特性门控的一部分完成的。

<!-- remove next 2 paragraphs when feature graduates to GA -->
<!--
Before Kubernetes v1.25, the kubelet used different default behavior for discovering mounted
volumes during the kubelet startup. If you disable this feature gate (it's enabled by default), you select
the legacy discovery behavior.

In Kubernetes v1.25 and v1.26, this behavior toggle was part of the `SELinuxMountReadWriteOncePod`
feature gate.
-->
在 Kubernetes v1.25 之前，kubelet 在启动期间使用不同的默认行为来发现已挂载的卷。
如果你禁用此特性门控（默认启用），则选择传统的发现方式。

在 Kubernetes v1.25 和 v1.26 中，此行为切换是 `SELinuxMountReadWriteOncePod` 特性门控的一部分。
