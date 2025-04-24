---
title: PDBUnhealthyPodEvictionPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"

removed: true
---
Вмикає поле `unhealthyPodEvictionPolicy` в полі `PodDisruptionBudget`. Визначає, коли слід розглядати можливість виселення несправних Podʼів. Будь ласка, дивіться [Політику виселення несправних Podʼів](/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy) для більш детальної інформації.
