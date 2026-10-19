---
title: DeclarativeValidation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
    toVersion: "1.35"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.36"
---
Reports differences between declarative validation of in-tree Kubernetes APIs and the
equivalent hand-written validation.

When enabled, rules marked `+k8s:alpha` or `+k8s:beta` run alongside the hand-written
validation, and the API server logs any discrepancy and counts it in the
`declarative_validation_mismatch_total` metric.

This gate controls only reporting, not which result the API server returns. Enforcement
is:

- No prefix: always enforced.
- `+k8s:beta`: enforced when the
  [`DeclarativeValidationBeta` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidationBeta)
  is enabled (the default).
- `+k8s:alpha`: never enforced.

This feature gate only operates on the `kube-apiserver` component.
