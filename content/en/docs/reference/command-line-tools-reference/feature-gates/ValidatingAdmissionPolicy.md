---
title: ValidatingAdmissionPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.27"
  - stage: beta
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.29"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
---
Enable [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/) support for CEL validations be used in Admission Control.
