---
title: DRAWorkloadResourceClaims
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
  - stage: beta
    defaultValue: false
    fromVersion: "1.37"
---
Вмикає підтримку ресурсів PodGroup з [Workload API](/docs/concepts/workloads/workload-api/) для запитів пристроїв через [динамічне виділення ресурсів](/docs/concepts/resource-management/dynamic-resource-allocation/), які можуть спільно використовуватися їхніми Podʼами-учасниками.
