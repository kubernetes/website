---
title: MutatingAdmissionPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.32"
---

Enable [MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/) support for CEL mutations be used in Admission Control.