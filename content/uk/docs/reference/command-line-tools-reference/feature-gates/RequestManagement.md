---
# Removed from Kubernetes
title: RequestManagement
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.15"
    toVersion: "1.16"
  - stage: deprecated
    fromVersion: "1.17"
    toVersion: "1.17"

removed: true
---
Дозволяє керувати паралельністю запитів з пріоритетами та справедливістю на кожному сервері API. Замінено на `APIPriorityAndFairness` з 1.17.
