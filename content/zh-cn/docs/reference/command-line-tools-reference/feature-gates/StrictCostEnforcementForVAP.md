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
  
<!--
Apply strict CEL cost validation for ValidatingAdmissionPolicies.
-->
对 ValidatingAdmissionPolicy 应用严格的 CEL 开销验证。
