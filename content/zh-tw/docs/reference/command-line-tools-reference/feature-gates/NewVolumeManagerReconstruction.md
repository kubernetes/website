---
title: NewVolumeManagerReconstruction
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
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.29"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"

removed: true
---

<!--
Enables improved discovery of mounted volumes during kubelet
startup. Since the associated code had been significantly refactored, Kubernetes versions 1.25 to 1.29
allowed you to opt-out in case the kubelet got stuck at the startup, or did not unmount volumes
from terminated Pods.
-->
在 kubelet 啓動期間啓用改進的掛載卷的發現。由於關聯的代碼已經進行了重大重構，
Kubernetes v1.25 到 v1.29 允許你不採用這一邏輯，以免 kubelet 在啓動時被卡住，或者未能爲已終止的 Pod 卸載卷。
請注意，此重構是作爲 Kubernetes 1.25 中的 `SELinuxMountReadWriteOncePod` Alpha 特性門控的一部分完成的。

<!--
This refactoring was behind the `SELinuxMountReadWriteOncePod`  feature gate in Kubernetes
releases 1.25 and 1.26.
-->
在 Kubernetes v1.25 和 v1.26 中，此重構行爲是 `SELinuxMountReadWriteOncePod` 特性門控的一部分。
