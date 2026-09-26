---
title: DRAPartitionableDevicesType
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Вмикає поле `PartitionTypeAttribute` у ResourceSlices, яке включає [розділюваний](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices) пул ресурсів у типізоване зведене представлення розділів [ResourcePoolStatusRequest](/docs/concepts/resource-management/dynamic-resource-allocation/dra-observability/#resource-pool-partition-summary). Поле називає атрибут пристрою (наприклад, профіль MIG), значення якого групує кожен тип розділу, щоб ResourcePoolStatusRequest міг повідомляти, скільки пристроїв кожного типу розділу все ще доступні для розподілу. Це ґрунтується на функціональних можливостях [`DRAPartitionableDevices`](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices) та [`DRAResourcePoolStatus`](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus), обидві з яких також мають бути увімкнені.
