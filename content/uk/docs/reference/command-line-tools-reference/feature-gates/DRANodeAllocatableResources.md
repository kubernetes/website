---
title: DRANodeAllocatableResources
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---
Дозволяє kube-scheduler враховувати ресурси Node Allocatable (такі як CPU, памʼять та hugepages), керовані Dynamic Resource Allocation (DRA), у своєму стандартному обліку ресурсів вузла.

Коли увімкнено, драйвери DRA можуть використовувати поле `nodeAllocatableResourceMappings` на пристроях `ResourceSlice`, щоб вказати, як їхні пристрої споживають ресурси Node Allocatable. Це дозволяє планувальнику поєднувати ці розподіли DRA зі стандартними запитами Pod. Також це відкриває поле `status.nodeAllocatableResourceClaimStatuses` у API Pod для відстеження результативних розподілів ресурсів.

Для отримання додаткової інформації див. [Ресурси вузла, доступні для виділення](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#node-allocatable-resources) у документації з Dynamic Resource Allocation.
