---
title: KubeProxyNFTablesLocalhostNodePorts
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
    toVersion: "1.37"
  - stage: beta
    defaultValue: true
    fromVersion: "1.38"

---
Enables localhost NodePort Service proxying with the nftables mode of
kube-proxy.
