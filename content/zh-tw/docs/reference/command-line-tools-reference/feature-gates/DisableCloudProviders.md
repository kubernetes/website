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
啓用此特性門控會取消新激活 `kube-apiserver`、`kube-controller-manager` 和 `kubelet` 中與
`--cloud-provider` 命令行參數相關的功能。

在 Kubernetes v1.31 及更高版本中，`--cloud-provider`
的唯一有效值爲空字符串（沒有云驅動集成組件）或 "external"（通過獨立的 cloud-controller-manager 進行集成）。
