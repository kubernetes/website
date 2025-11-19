---
title: DisableKubeletCloudCredentialProviders
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
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
Enabling the feature gate deactivated the legacy in-tree functionality within the
kubelet, that allowed the kubelet to to authenticate to a cloud provider container registry
for container image pulls.
-->
啓用此特性門控將停用 kubelet 中舊版的樹內功能，
該功能原本允許 kubelet 對雲提供商的容器倉庫進行身份驗證以拉取容器映像檔。
