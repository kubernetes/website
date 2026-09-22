---
title: DRAPrioritizedList
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
    toVersion: "1.35"
  - stage: stable
    defaultValue: true
    locked: false
    fromVersion: "1.36"
---

Дозволяє вказати пріоритетний список альтернативних пристроїв, які можуть бути виділені для запиту в ResourceClaim, якщо бажаний альтернативний пристрій недоступний.
