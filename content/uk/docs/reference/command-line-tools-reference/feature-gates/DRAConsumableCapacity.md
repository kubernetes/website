---
title: DRAConsumableCapacity
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---

Дозволяє спільне використання пристрою в декількох ResourceClaims або запитах.

Крім того, якщо пристрій підтримує спільне використання, його ресурсом (ємністю) можна керувати за допомогою визначеної політики спільного використання.
