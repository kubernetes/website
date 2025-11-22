---
title: AllowDNSOnlyNodeCSR
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.31"
---
Allow kubelet to request a certificate without any Node IP available, only with DNS names.

