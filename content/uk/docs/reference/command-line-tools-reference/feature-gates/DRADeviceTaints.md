---
title: DRADeviceTaints
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
    toVersion: "1.37"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.37"
---
Увімкнення підтримки [позначення пристроїв позначкою taint і вибіркового толерування цих позначок](/docs/concepts/resource-management/dynamic-resource-allocation/device-taints/#device-taints-and-tolerations) під час використання динамічного виділення ресурсів для керування пристроями.
