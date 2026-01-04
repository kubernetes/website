---
title: DRADeviceTaintRules
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Уможливлює підтримку [позначення пристроїв позначкою taint за допомогою обʼєктів DeviceTaintRule](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations) під час використання динамічного розподілу ресурсів для управління пристроями.

Ця функція не діє, якщо ви також не увімкнете функцію `DRADeviceTaint`.
