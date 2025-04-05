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
---
Enables declarative validation of in-tree Kubernetes APIs. When enabled, APIs with declarative validation rules (defined using IDL tags in the Go code) will have both the generated declarative validation code and the original hand-written validation code executed.  The results are compared, and any discrepancies are reported via the `declarative_validation_mismatch_total` metric.  Only the hand-written validation result is returned to the user (eg: actually validates in the request path).  The original hand-written validation are still the authoritative validations when this is enabled but this can be changed if the [DeclarativeValidationTakeover feature gate](/docs/reference/command-line-tools-reference/feature-gates/DeclarativeValidationTakeover.md) is enabled in addition to this gate.  This feature gate only operates on the kube-apiserver.
