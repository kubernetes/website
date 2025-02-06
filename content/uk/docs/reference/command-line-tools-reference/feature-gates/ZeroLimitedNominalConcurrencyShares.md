---
title: ZeroLimitedNominalConcurrencyShares
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.29"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"

removed: true
---

Дозволити [priority & fairness](/docs/concepts/cluster-administration/flow-control/) на сервері API використовувати нульове значення для поля `nominalConcurrencyShares` секції `limited` рівня пріоритету.
