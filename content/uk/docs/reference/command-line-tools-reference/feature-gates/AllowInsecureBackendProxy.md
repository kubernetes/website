---
# Removed from Kubernetes
title: AllowInsecureBackendProxy
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.20"
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.25"

removed: true
---
Дозволяє користувачам пропускати перевірку TLS для kubelet на запитах до логів Pod.
