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
---
Увімкнення підтримки [позначення пристроїв позначкою taint і вибіркове толерування цих позначок](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations) під час використання динамічного розподілу ресурсів для керування пристроями.
