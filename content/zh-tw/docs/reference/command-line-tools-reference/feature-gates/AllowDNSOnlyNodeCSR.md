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
允許 kubelet 在不提供節點 IP、僅提供 DNS 名稱的情況下請求證書。
