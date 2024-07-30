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
    
---
Enable enforcement of the strict cost calculation for CEL extended libraries used within a
[ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/).