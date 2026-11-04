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
    toVersion: "1.35"
  - stage: beta
    defaultValue: false
    fromVersion: "1.36"
    toVersion: "1.37"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.37"
---
Уможливлює підтримку [позначення пристроїв позначкою taint за допомогою обʼєктів DeviceTaintRule](/docs/concepts/resource-management/dynamic-resource-allocation/device-taints/#device-taints-and-tolerations) під час використання динамічного виділення ресурсів для управління пристроями.

Ця функціональна можливість не діє, якщо ви також не увімкнете функціональну можливість `DRADeviceTaints`.
