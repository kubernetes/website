---
title: MutablePVNodeAffinity
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Дозволяє оновлення поля `.spec.nodeAffinity` PersistentVolume. Дивіться [Оновлення до вузлової спорідненості](/docs/concepts/storage/persistent-volumes/#updates-to-node-affinity) для більш детальної інформації.
