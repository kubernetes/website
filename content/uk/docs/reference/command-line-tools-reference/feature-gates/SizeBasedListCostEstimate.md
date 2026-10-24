---
title: SizeBasedListCostEstimate
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---
Дозволяє APF використовувати розмір обʼєктів для оцінки вартості запиту.
