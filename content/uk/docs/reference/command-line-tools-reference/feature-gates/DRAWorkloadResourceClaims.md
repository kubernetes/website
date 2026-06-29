---
title: DRAWorkloadResourceClaims
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---

Вмикає підтримку ресурсів PodGroup з [Workload API](/docs/concepts/workloads/workload-api/) для запитів пристроїв через [Динамічне виділення ресурсів](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/), які можуть бути спільно використані їхніми учасниками Pods.
