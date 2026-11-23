---
title: KubeProxyNFTablesLocalhostNodePorts
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"

---
Вмикає проксіювання локальних NodePort Service за допомогою режиму nftables kube-proxy.
