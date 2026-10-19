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
允许一段时间后（默认 10 秒，可在 DynamicResources 调度器插件配置中设置）在调度器中中止每个节点的过滤操作。
