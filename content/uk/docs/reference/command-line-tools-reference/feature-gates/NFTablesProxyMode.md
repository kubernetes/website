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
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
---
Дозволяє запуск kube-proxy у режимі [nftables](/docs/reference/networking/virtual-ips/#proxy-mode-nftables).
