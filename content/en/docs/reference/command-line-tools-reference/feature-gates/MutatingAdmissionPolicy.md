---
title: MutatingAdmissionPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.33"
  - stage: beta
    defaultValue: false
    fromVersion: "1.34"
---

Enable [MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/) support, which allows
[CEL](/docs/reference/using-api/cel/) mutations to
be applied during admission control.

For Kubernetes v1.30 and v1.31, this feature gate existed but had no effect.