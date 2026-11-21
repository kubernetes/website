---
title: PodLevelResourceManagers
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
    toVersion: "1.36"
  - stage: beta
    defaultValue: false
    fromVersion: "1.37"
---
Вмикає _Pod-level resource managers_: можливість для менеджерів топології, CPU та памʼяті використовувати інформацію з `.spec.resources` для виконання вирівнювання NUMA для всього Podʼа та гнучкого управління ресурсами для контейнерів у цьому Podʼі.
