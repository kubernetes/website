---
title: InformerResourceVersion
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
---
Вмикає перевірку останньої синхронізованої версії ресурсу за допомогою інформера.
