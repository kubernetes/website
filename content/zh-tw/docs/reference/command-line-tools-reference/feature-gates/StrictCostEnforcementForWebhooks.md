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
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
---
  
<!--
Apply strict CEL cost validation for `matchConditions` within
admission webhooks.
-->
在准入 Webhook 內對 `matchConditions` 應用嚴格的 CEL 開銷驗證。
