---
title: StrictCostEnforcementForVAP
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
---
اعتبارسنجی دقیق هزینه‌های CEL را برای ValidatingAdmissionPolicies اعمال کنید.

