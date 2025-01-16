---
title: ServiceTrafficDistribution
content_type: feature_gate

_build:
  list: never
  render: false

stages:
- stage: alpha
  defaultValue: false
  fromVersion: "1.30"
  toVersion: "1.30"
- stage: beta
  defaultValue: true
  fromVersion: "1.31"
---
Дозволяє використовувати необовʼязкове поле `spec.trafficDistribution` у Services. У цьому полі можна вказати параметри розподілу трафіку між точками доступу Service.
