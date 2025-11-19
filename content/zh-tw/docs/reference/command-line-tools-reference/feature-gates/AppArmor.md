---
title: AppArmor
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.4"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"

removed: true
---

<!--
Enable use of AppArmor mandatory access control for Pods running on Linux nodes.
See [AppArmor Tutorial](/docs/tutorials/security/apparmor/) for more details.
-->
爲 Linux 節點上運行的 Pod 啓用 AppArmor 機制的強制訪問控制。
更多細節參閱 [AppArmor 教程](/zh-cn/docs/tutorials/security/apparmor/)。
