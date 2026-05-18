---
title: DRAResourcePoolStatus
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---
Вмикає API ResourcePoolStatusRequest для запиту [наявності пристроїв у ресурсних пулах DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resource-pool-status). Коли функція увімкнена, користувачі можуть створювати обʼєкти ResourcePoolStatusRequest, щоб отримати моментальний знімок наявності пристроїв (загальна кількість, виділені, доступні та недоступні пристрої) для конкретного драйвера та, за бажанням, для конкретного пулу. Контролер у kube-controller-manager обробляє ці одноразові запити та заповнює статус інформацією про пул.
