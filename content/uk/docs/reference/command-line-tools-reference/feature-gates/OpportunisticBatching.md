---
title: OpportunisticBatching
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---
Вмикає повторне використання результатів планування з попереднього циклу планування для еквівалентних подів.
