---
# Removed from Kubernetes
title: PodShareProcessNamespace
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.10"
    toVersion: "1.11"
  - stage: beta
    defaultValue: true
    fromVersion: "1.12"
    toVersion: "1.16"
  - stage: stable
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.19"

removed: true
---
Вмикає параметр `shareProcessNamespace` у Pod для спільного використання єдиного простору імен процесів між контейнерами, запущеними у Pod. Більш детальну інформацію можна знайти у статті [Спільний простір імен процесів між контейнерами у Pod](/docs/tasks/configure-pod-container/share-process-namespace/).
