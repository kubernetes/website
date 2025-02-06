---
title: DRAResourceClaimDeviceStatus
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---

Вмикає підтримку поля ResourceClaim.status.devices та встановлення цього статусу з драйверів DRA.
