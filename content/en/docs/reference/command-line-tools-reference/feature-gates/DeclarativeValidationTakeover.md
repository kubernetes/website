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
---
When enabled, along with the [DeclarativeValidation](/docs/reference/command-line-tools-reference/feature-gates/DeclarativeValidation.md) feature gate, declarative validation errors are returned directly to the caller, replacing hand-written validation errors for rules that have declarative implementations. When disabled (and `DeclarativeValidation` is enabled), hand-written validation errors are always returned, effectively putting declarative validation in a __mismatch validation mode__ that monitors but does not affect API responses.  This __mismatch validation mode__  allows for the monitoring of the `declarative_validation_mismatch_total` and `declarative_validation_panic_total` metrics which are implementation details for a safer rollout, average user shouldn't need to interact with it directly. This feature gate only operates on the kube-apiserver.  Note: Although declarative validation aims for functional equivalence with hand-written validation, the exact description of error messages may differ between the two approaches.