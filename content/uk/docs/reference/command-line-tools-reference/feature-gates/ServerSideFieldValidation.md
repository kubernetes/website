---
title: ServerSideFieldValidation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.24"
  - stage: beta
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.26"
  - stage: stable
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.31"

removed: true
---

Вмикає перевірку полів на стороні сервера. Це означає, що перевірка схеми ресурсів виконується на стороні сервера API, а не на стороні клієнта (наприклад, командний рядок `kubectl create` або `kubectl apply`).
