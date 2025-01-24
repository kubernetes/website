---
title: AllowDNSOnlyNodeCSR
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.31"
---
  
<!--
Allow kubelet to request a certificate without any Node IP available, only with DNS names.
-->
允许 kubelet 在不提供节点 IP、仅提供 DNS 名称的情况下请求证书。
