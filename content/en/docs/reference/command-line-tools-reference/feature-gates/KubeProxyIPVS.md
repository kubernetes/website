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

Enable support for the deprecated [`ipvs` proxy mode](/docs/reference/networking/virtual-ips/#proxy-mode-ipvs) in kube-proxy.
