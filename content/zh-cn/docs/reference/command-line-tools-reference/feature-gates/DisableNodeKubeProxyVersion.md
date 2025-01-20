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
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: '1.31.0'
    toVersion: '1.31.0'
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.31.1"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.32"
---

<!--
Disable setting the `kubeProxyVersion` field of the Node.
-->
禁止设置 Node 的 `kubeProxyVersion` 字段。
