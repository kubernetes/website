---
# Removed from Kubernetes
title: RequestManagement
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.15"
    toVersion: "1.16"
  - stage: deprecated
    fromVersion: "1.17"
    toVersion: "1.17"

removed: true
---

<!--
Enables managing request concurrency with prioritization and fairness
at each API server. Deprecated by `APIPriorityAndFairness` since 1.17.
-->
允许在每个 API 服务器上通过优先级和公平性来管理请求并发性。
自 1.17 以来已被 `APIPriorityAndFairness` 替代。
