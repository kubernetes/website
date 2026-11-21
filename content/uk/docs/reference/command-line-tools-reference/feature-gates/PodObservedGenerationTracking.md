---
title: PodObservedGenerationTracking
content_type: feature_gate
_build:
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
    toVersion: "1.34"
  - stage: stable
    locked: true
    defaultValue: true
    fromVersion: "1.35"
---
Дозволяє kubelet встановлювати `observedGeneration` у `.status` Podʼа, а також дозволяє іншим компонентам встановлювати `observedGeneration` в станах Podʼів. Ця функція дозволяє відобразити `.metadata.generation` Podʼа на момент запису загального статусу або певного стану. Зберігання цієї інформації допомагає уникнути ризиків, повʼязаних із _втраченими оновленнями_.
