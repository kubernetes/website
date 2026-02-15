---
# Removed from Kubernetes
title: SupportNodePidsLimit
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.14"
  - stage: beta
    defaultValue: true
    fromVersion: "1.15"
    toVersion: "1.19"
  - stage: stable
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.23"

removed: true
---
Вмикає підтримку обмеження PID на вузлі.  Параметр `pid=<number>` в опціях `--system-reserved` і `--kube-reserved` можна вказати, щоб гарантувати, що вказану кількість ідентифікаторів процесів буде зарезервовано для системи в цілому і для системних демонів Kubernetes відповідно.
