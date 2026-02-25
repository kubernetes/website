---
title: StorageCapacityScoring
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---
У версії 1.32 для підтримки сховищ зі статичним резервуванням використовувався елемент `VolumeCapacityPriority`. Починаючи з версії 1.33, новий елемент `StorageCapacityScoring` замінює старий елемент `VolumeCapacityPriority` з додатковою підтримкою сховищ з динамічним резервуванням. Коли `StorageCapacityScoring` увімкнено, втулок VolumeBinding у kube-scheduler розширено, щоб оцінювати вузли на основі місткості сховища на кожному з них. Ця функція застосовується до томів CSI, які підтримують [Обсяг сховища](/docs/concepts/storage/storage-capacity/), включно з локальним сховищем, яке підтримується драйвером CSI.
