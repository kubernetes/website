---
title: DisableCloudProviders
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"

removed: true
---

<!--
Enabling this feature gate deactivated functionality in `kube-apiserver`,
`kube-controller-manager` and `kubelet` that related to the `--cloud-provider`
command line argument.

In Kubernetes v1.31 and later, the only valid values for `--cloud-provider`
are the empty string (no cloud provider integration), or "external"
(integration via a separate cloud-controller-manager).
-->
启用此特性门控会取消新激活 `kube-apiserver`、`kube-controller-manager` 和 `kubelet` 中与
`--cloud-provider` 命令行参数相关的功能。

在 Kubernetes v1.31 及更高版本中，`--cloud-provider`
的唯一有效值为空字符串（没有云驱动集成组件）或 "external"（通过独立的 cloud-controller-manager 进行集成）。
