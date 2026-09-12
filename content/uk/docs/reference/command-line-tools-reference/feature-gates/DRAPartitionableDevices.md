---
title: DRAPartitionableDevices
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
Увімкнути підтримку запиту [Пристрої, що розділяються на розділи](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices) для DRA. Це дозволяє драйверам оголошувати декілька пристроїв, які зіставляються з тими самими ресурсами фізичного пристрою.
