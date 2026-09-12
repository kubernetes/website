---
title: NodeLogQuery
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.29"
  - stage: beta
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.35"
  - stage: stable
    defaultValue: true
    fromVersion: "1.36"
---
Дозволяє запитувати логи сервісів вузла за допомогою точки доступу `/logs`.
