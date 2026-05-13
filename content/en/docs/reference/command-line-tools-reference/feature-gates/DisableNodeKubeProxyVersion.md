---
title: DisableNodeKubeProxyVersion
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    locked: false
    fromVersion: "1.29"
    toVersion: "1.30"
  - stage: deprecated
    defaultValue: false
    locked: false
    fromVersion: "1.31"
    toVersion: "1.32"
  - stage: deprecated
    defaultValue: true
    locked: false
    fromVersion: "1.33"
    toVersion: "1.35"
  - stage: deprecated
    defaultValue: true
    locked: true
    fromVersion: "1.36"
---

Disable setting the `kubeProxyVersion` field of the Node.
