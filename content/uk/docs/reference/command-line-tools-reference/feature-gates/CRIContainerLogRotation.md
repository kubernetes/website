---
# Removed from Kubernetes
title: CRIContainerLogRotation
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.10"
    toVersion: "1.10"
  - stage: beta
    defaultValue: true
    fromVersion: "1.11"
    toVersion: "1.20"
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"

removed: true
---
Вмикає ротацію логів контейнера для середовища виконання контейнерів CRI. Стандартний максимальний розмір файлу логу становить 10 МБ, а максимальна кількість файлів логу для контейнера — 5. Ці значення можна налаштувати у конфігурації kubelet. Див. статтю [ведення логів на рівні вузла](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level) для більш детальної інформації.
