---
title: StrictCostEnforcementForVAP
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.31"
---

Застосовує сувору валідацію витрат CEL для ValidatingAdmissionPolicies.
