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
---

Enable [MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/) support for [CEL](https://kubernetes.io/docs/reference/using-api/cel/) mutations be used in admission control.

For Kubernetes v1.30 and v1.31, this feature gate existed but had no effect.