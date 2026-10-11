---
title: DeclarativeValidationTakeover
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.35"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.36"
    toVersion: "1.36"
  - stage: deprecated
    defaultValue: false
    locked: true
    fromVersion: "1.37"
---
Застаріло: замінено функціональною можливістю [`DeclarativeValidationBeta`](/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidationBeta).

До Kubernetes v1.36 ця функціональна можливість робила помилки декларативної валідації авторитетними, замінюючи помилки рукописної валідації для правил, які мали декларативну реалізацію.

API-сервер більше не враховує цю функціональну можливість. Використовуйте `DeclarativeValidationBeta` натомість, щоб
керувати тим, чи застосовуються правила `+k8s:beta`.

Ця функціональна можливість працює лише на компоненті `kube-apiserver`.
