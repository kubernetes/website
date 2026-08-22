---
title: MemoryQoS
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.22"
---
Вмикає захист памʼяті та обмеження використання памʼяті на pod/контейнер за допомогою контролера памʼяті cgroup v2. Встановлює `memory.high` для обмеження на Burstable pods, а також опціонально встановлює `memory.min`/`memory.low` для багаторівневого захисту памʼяті, коли `memoryReservationPolicy` встановлено на `TieredReservation`.
