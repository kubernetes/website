---
title: DRAAdminAccess
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---

Вмикає підтримку запиту [доступу адміністратора](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#admin-access) у заявці на ресурс. Вимога ресурсу з доступом адміністратора надає доступ до пристроїв, які використовуються, і може увімкнути додаткові дозволи доступу, коли робить пристрій доступним у контейнері.

Ця функціональна можливість не має ефекту, якщо ви також не увімкнули функціональну можливість `DynamicResourceAllocation`.
