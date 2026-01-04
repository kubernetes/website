---
title: DRASchedulerFilterTimeout
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
---

<!--
Enables aborting the per-node filter operation in the scheduler after a certain
time (10 seconds by default, configurable in the DynamicResources scheduler
plugin configuration).
-->
允許一段時間後（預設 10 秒，可在 DynamicResources 調度器插件設定中設置）在調度器中中止每個節點的過濾操作。
