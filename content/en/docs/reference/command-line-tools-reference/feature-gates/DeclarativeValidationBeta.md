---
title: DeclarativeValidationBeta
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
This feature gate acts as the Global Safety Switch for Beta-stage validation rules (`+k8s:beta`).
It allows cluster admins to disable enforcement for validations in the Beta stage if
regressions are found, forcing them back to Shadow mode.

In Shadow mode, declarative validation is executed and mismatches against handwritten
validation are logged as metrics, but failures do not reject requests.
Handwritten validation remains authoritative and enforced.

Enforcement logic for resources using `WithDeclarativeEnforcement()`:
- Standard tags (no prefix): Always Enforced (Bypasses this gate).
- Beta tags (`+k8s:beta`): Enforced when this gate is enabled (default), otherwise Shadowed.
- Alpha tags (`+k8s:alpha`): Always Shadowed.

This gate has no effect if the master `DeclarativeValidation` feature gate is disabled.
