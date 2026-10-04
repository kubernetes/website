---
title: StrictCostEnforcementForWebhooks
content_type: feature_gate

build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.31"
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
---

Застосовує сувору перевірку вартості CEL для `matchConditions` у вебхуків допуску.
