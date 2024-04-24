---
title: NFTablesProxyMode
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.29"
---

<!--
Allow running kube-proxy with in [nftables mode](/docs/reference/networking/virtual-ips/#proxy-mode-nftables).
-->
允许使用
[nftables 模式](/zh-cn/docs/reference/networking/virtual-ips/#proxy-mode-nftables)运行 kube-proxy。
