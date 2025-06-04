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
启用此特性门控将停用 kubelet 中旧版的树内功能，
该功能原本允许 kubelet 对云提供商的容器仓库进行身份验证以拉取容器镜像。
