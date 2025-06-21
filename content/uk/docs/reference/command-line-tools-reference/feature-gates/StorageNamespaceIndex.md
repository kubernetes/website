---
title: StorageNamespaceIndex
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.32"
  - stage: deprecated
    defaultValue: true
    fromVersion: "1.33"

---
Вмикає індексатор простору імен для ресурсів, обмежених простором імен, в кеші сервера API для прискорення операцій list.
