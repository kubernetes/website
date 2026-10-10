---
title: DRAResourceClaimDeviceStatus
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
    toVersion: "1.36"
  - stage: stable
    defaultValue: true
    fromVersion: "1.37"
---
Вмикає підтримку поля ResourceClaim.status.devices та встановлення цього статусу з драйверів DRA. Для цього потрібно увімкнути функціональну можливість `DynamicResourceAllocation`.
