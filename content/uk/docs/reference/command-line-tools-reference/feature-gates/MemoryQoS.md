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
    toVersion: "1.36"
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
Вмикає захист памʼяті та обмеження використання памʼяті для Podʼів і контейнерів за допомогою контролера памʼяті cgroup v2. Коли встановлено `memoryThrottlingFactor`, `kubelet` встановлює `memory.high` для обмеження на контейнерах Burstable та BestEffort. `kubelet` опціонально встановлює `memory.min` та `memory.low` для багаторівневого захисту памʼяті, коли `memoryReservationPolicy` встановлено на `TieredReservation`. Функція вимагає обох умов: увімкнення функціональної можливості та налаштування конфігурації `kubelet`.
