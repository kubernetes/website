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
به [priority & fairness](/docs/concepts/cluster-administration/flow-control/) در سرور API اجازه دهید تا از مقدار صفر برای فیلد `nominalConcurrencyShares` در بخش `limited` از سطح اولویت استفاده کند.