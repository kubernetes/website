---
title: DryRun
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.12"
    toVersion: "1.12"
  - stage: beta
    defaultValue: true
    fromVersion: "1.13"
    toVersion: "1.18"
  - stage: stable
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.27"

removed: true
---
Вмикає запити [dry rin](/docs/reference/using-api/api-concepts/#dry-run) на боці сервера, щоб можна було тестувати валідацію, злиття та мутацію без впровадження змін.
