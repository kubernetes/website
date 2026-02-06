---
# Removed from Kubernetes
title: CSIVolumeFSGroupPolicy
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.19"
    toVersion: "1.19"
  - stage: beta
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.22"
  - stage: stable
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.25"

removed: true
---
Дозволяє CSIDrivers використовувати поле `fsGroupPolicy`. Це поле керує тим, чи підтримують томи, створені CSIDriver, власність томів та зміни дозволів, коли ці томи монтуються.
