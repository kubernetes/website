---
title: DeclarativeValidationTakeover
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.35"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.36"
    toVersion: "1.36"
  - stage: deprecated
    defaultValue: false
    locked: true
    fromVersion: "1.37"
---
Deprecated: replaced by the
[`DeclarativeValidationBeta` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidationBeta).

Before Kubernetes v1.36, this gate made declarative validation errors authoritative,
replacing the hand-written errors for rules that had a declarative implementation.

The API server no longer honors this gate. Use `DeclarativeValidationBeta` instead to
control whether `+k8s:beta` rules are enforced.

This feature gate only operates on the `kube-apiserver` component.
