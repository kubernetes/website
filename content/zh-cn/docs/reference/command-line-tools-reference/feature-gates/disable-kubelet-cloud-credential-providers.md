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
---
<!--
Disable the in-tree functionality in kubelet
to authenticate to a cloud provider container registry for image pull credentials.
-->
禁用 kubelet 中为拉取镜像内置的凭据机制，
该凭据用于向云提供商的容器镜像仓库进行身份认证。
