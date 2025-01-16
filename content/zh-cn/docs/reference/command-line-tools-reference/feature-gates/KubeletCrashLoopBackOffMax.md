---
title: KubeletCrashLoopBackOffMax
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---

<!--
Enables support for configurable per-node backoff maximums for restarting
containers in the CrashLoopBackOff state.
-->
启用对可逐节点配置的、在重启 CrashLoopBackOff 状态的容器时回退最大值的支持。
