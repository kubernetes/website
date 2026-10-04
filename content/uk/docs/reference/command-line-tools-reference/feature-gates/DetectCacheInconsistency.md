---
title: DetectCacheInconsistency
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---
Вмикає виявлення неузгодженості кеша в сервері API.
