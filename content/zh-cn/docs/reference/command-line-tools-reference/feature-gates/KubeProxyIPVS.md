---
title: KubeProxyIPVS
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: true
    fromVersion: "1.37"
---

<!--
Enable support for the deprecated [`ipvs` proxy mode](/docs/reference/networking/virtual-ips/#proxy-mode-ipvs) in kube-proxy.
-->
在 kube-proxy 中启用对已弃用的
[`ipvs` 代理模式](/zh-cn/docs/reference/networking/virtual-ips/#proxy-mode-ipvs)的支持。
