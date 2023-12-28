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
---
Allow [Priority & Fairness](/docs/concepts/cluster-administration/flow-control/)
in the API server to use a zero value for the `nominalConcurrencyShares` field of
the `limited` section of a priority level.
