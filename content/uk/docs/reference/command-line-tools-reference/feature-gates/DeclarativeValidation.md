---
title: DeclarativeValidation
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
    toVersion: "1.35"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.36"
---

Повідомляє про розбіжності між декларативною валідацією внутрішніх API Kubernetes та еквівалентною рукописною валідацією.

Якщо увімкнено, правила, позначені `+k8s:alpha` або `+k8s:beta`, працюють поряд з рукописною валідацією, і API-сервер реєструє будь-які розбіжності та підраховує їх у метриці `declarative_validation_mismatch_total`.

Ця функціональна можливість керує лише звітуванням, а не тим, який результат повертає API-сервер. Застосування:

- Без префікса: завжди застосовується.
- `+k8s:beta`: застосовується, коли увімкнено функціональну можливість [`DeclarativeValidationBeta`](/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidationBeta) (стандартно увімкнено).
- `+k8s:alpha`: ніколи не застосовується.

Ця функціональна можливість працює лише на компоненті `kube-apiserver`.
