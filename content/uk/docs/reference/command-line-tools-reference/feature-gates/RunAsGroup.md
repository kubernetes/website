---
# Removed from Kubernetes
title: RunAsGroup
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.14"
    toVersion: "1.20"
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"

removed: true
---
Вмикає контроль за первинним ідентифікатором групи, встановленим у процесах ініціалізації контейнерів.
