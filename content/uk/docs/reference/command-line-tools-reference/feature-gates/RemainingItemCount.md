---
title: RemainingItemCount
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.15"
    toVersion: "1.15"
  - stage: beta
    defaultValue: true
    fromVersion: "1.16"
    toVersion: "1.28"
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.32"

removed: true
---
Дозволити серверам API показувати кількість елементів, що залишилися, у відповіді на запит [chunking list request](/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks).
