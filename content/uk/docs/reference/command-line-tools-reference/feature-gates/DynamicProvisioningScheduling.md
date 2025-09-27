---
# Removed from Kubernetes
title: DynamicProvisioningScheduling
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.11"
    toVersion: "1.11"
  - stage: deprecated
    fromVersion: "1.12"

removed: true
---
Розширює стандартний планувальник, щоб врахувати топологію тома і обробляти виділення PV. Цю функцію було замінено функцією `VolumeScheduling` у версії 1.12.
