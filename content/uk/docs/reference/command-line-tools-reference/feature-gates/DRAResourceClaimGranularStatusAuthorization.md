---
title: DRAResourceClaimGranularStatusAuthorization
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---

Вмикає підтримку детальної авторизації оновлень статусу ResourceClaim. Ця функція вимагає додаткових детальних прав доступу при зміні конкретних полів у обʼєктах статусу ResourceClaim.
