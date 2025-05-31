---
title: ConsistentHTTPGetHandlers
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.30"

removed: true
---
Нормалізувати передачу URL-адреси та заголовка HTTP-запиту для життєвого циклу обробників з пробами.
