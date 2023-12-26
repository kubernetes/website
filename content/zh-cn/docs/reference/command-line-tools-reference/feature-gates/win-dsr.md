---
title: WinDSR
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.14"
---

<!--
Allows kube-proxy to create DSR loadbalancers for Windows.
-->
允许 kube-proxy 为 Windows 创建 DSR（Direct Server Return，直接服务器返回）负载均衡器。
