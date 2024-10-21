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
This is used to apply strict CEL cost validation for ValidatingAdmissionPolicy.
The strict cost is specific for the extended library whose cost is defined under
k8s/apiserver/pkg/cel/library.

