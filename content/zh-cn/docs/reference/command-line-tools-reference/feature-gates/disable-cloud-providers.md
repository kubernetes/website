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
---
<!--
Disables any functionality in `kube-apiserver`,
`kube-controller-manager` and `kubelet` related to the `--cloud-provider`
component flag.
-->
禁用 `kube-apiserver`、`kube-controller-manager`
和 `kubelet` 中与 `--cloud-provider` 组件标志相关的所有功能。
