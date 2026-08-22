---
title: PodLevelResourceManagers
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---
Вмикає _Pod-level resource managers_: можливість для менеджерів топології, CPU та памʼяті використовувати інформацію з `.spec.resources` для виконання вирівнювання NUMA для всього поду та гнучкого управління ресурсами для контейнерів у цьому поді.
