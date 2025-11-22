---
title: PodAndContainerStatsFromCRI
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
---
Налаштуйте kubelet на збір статистики контейнерів і Podʼів під час виконання CRI-контейнера, а не на збір статистики з cAdvisor. Починаючи з версії 1.26, це також включає збір метрик з CRI та надсилання їх за допомогою `/metrics/cadvisor` (замість того, щоб cAdvisor відправляв їх безпосередньо).
