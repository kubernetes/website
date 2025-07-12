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
在准入 Webhook 内对 `matchConditions` 应用严格的 CEL 开销验证。
