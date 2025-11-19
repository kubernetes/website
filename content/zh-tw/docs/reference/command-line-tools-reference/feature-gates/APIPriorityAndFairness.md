---
title: APIPriorityAndFairness
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.18"
    toVersion: "1.19"
  - stage: beta
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.28"
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.30"

removed: true
---

<!--
Enable managing request concurrency with
prioritization and fairness at each server. (Renamed from `RequestManagement`)
-->
在每個服務器上啓用優先級和公平性來管理請求的併發度（由 `RequestManagement` 重命名而來）。
