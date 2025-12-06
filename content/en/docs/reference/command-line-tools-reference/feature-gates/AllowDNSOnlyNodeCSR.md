---
title: AllowDNSOnlyNodeCSR
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: stable
    defaultValue: true
    fromVersion: "1.0"
    toVersion: "1.30"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.31"
---
Allow kubelet to request a certificate without any Node IP available, only with DNS names.
