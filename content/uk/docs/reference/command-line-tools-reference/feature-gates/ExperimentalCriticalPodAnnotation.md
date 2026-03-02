---
# Removed from Kubernetes
title: ExperimentalCriticalPodAnnotation
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.5"
    toVersion: "1.12"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.13"
    toVersion: "1.16"

removed: true
---
Увімкнути позначення певних Podʼів як *критичних*, щоб гарантувати їх [планування](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/). Ця функція застаріла внаслідок використання пріоритетів та випередження для Podʼів, починаючи з версії 1.13.
