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
Дозволяє kubelet встановлювати `observedGeneration` у статусі Podʼів, а також дозволяє іншим компонентам встановлювати `observedGeneration` в станах Podʼів. Ця функція дозволяє відобразити `metadata.generation` Podʼу на момент запису статусу або стану. Зберігання цієї інформації допомагає уникнути ризиків, повʼязаних із _втраченими оновленнями_.
