---
title: DRAPrioritizedList
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---
Вмикає підтримку функції [Prioritized List](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#prioritized-list). Вона дає змогу вказати пріоритетний список підзапитів для запитів у ResourceClaim.

Цей елемент не має ефекту, якщо ви не увімкнули функціональну можливість `DynamicResourceAllocation`.
