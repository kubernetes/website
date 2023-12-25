---
title: DisableNodeKubeProxyVersion
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.29"
---
Disable setting the `kubeProxyVersion` field of the Node.
