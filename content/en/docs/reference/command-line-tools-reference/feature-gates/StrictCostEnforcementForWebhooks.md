---
title: StrictCostEnforcementForWebhooks
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.31"
---
Apply strict CEL cost validation for `matchConditions` within
admission webhooks.
