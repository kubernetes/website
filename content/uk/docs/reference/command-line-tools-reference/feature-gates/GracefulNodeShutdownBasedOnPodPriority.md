---
title: GracefulNodeShutdownBasedOnPodPriority
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.23"
  - stage: beta
    defaultValue: true
    fromVersion: "1.24"
---
Дозволяє kubelet перевіряти пріоритети Pod під час відповідного завершення роботи вузла.
