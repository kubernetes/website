---
title: KubeProxyIPVS
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: true
    fromVersion: "1.37"
---

Вмикає підтримку застарілого [режиму проксі `ipvs`](/docs/reference/networking/virtual-ips/#proxy-mode-ipvs) у kube-proxy.
