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
---
Дозволяє kubelet встановлювати `observedGeneration` у статусі podʼів та іншим компонентам встановлювати `observedGeneration` в станах podʼів, щоб відобразити `metadata.generation` podʼу на момент запису статусу або стану.
