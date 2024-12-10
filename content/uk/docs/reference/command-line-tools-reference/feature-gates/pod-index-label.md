---
title: PodIndexLabel
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
---
Дозволяє контролеру Job і контролеру StatefulSet додавати індекс Podʼів як мітку під час створення нових Podʼів. Докладніше дивіться в документах [Режим завершення завдання](/uk/docs/concepts/workloads/controllers/job#completion-mode) та [Мітка індексу Podʼів StatefulSet](/uk/docs/concepts/workloads/controllers/statefulset/#pod-index-label).
