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
Enables aborting the per-node filter operation in the scheduler after a certain
time (10 seconds by default, configurable in the DynamicResources scheduler
plugin configuration).

