---
title: VolumeCapacityPriority
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.21"
---
Вмикання підтримки пріоритезації вузлів у різних топологіях на основі доступної місткості PV.
