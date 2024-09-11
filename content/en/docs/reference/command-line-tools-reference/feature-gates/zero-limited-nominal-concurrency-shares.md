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
---
Allow [priority & fairness](/docs/concepts/cluster-administration/flow-control/)
in the API server to use a zero value for the `nominalConcurrencyShares` field of
the `limited` section of a priority level.
