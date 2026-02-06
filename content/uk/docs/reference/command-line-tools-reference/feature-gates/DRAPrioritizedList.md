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
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

Вмикає підтримку функції [Prioritized List](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#prioritized-list). Вона дає змогу вказати пріоритетний список підзапитів для запитів у ResourceClaim.
