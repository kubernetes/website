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
اعتبارسنجی دقیق هزینه CEL را برای `matchConditions` در وب‌هوک‌های پذیرش اعمال کنید.