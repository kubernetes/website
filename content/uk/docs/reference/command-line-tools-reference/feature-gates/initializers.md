---
title: Initializers
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.7"
    toVersion: "1.13"
  - stage: deprecated
    fromVersion: "1.14"
    toVersion: "1.14"

removed: true
---
Дозволяє асинхронно координувати створення обʼєктів за допомогою втулка допуску Initializers.
