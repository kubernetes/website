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
    toVersion: "1.32"

removed: true
---
Вмикання підтримки пріоритезації вузлів у різних топологіях на основі доступної місткості PV. Цю функцію було перейменовано на `StorageCapacityScoring` у v1.33.
