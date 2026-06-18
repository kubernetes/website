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

Allow selecting the `ipvs` proxy mode in kube-proxy.
See
[IPVS proxy mode](/docs/reference/networking/virtual-ips/#proxy-mode-ipvs)
for more details.
