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
The global safety switch for Beta validation rules (`+k8s:beta`). Disable it to revert
those rules to shadow mode if regressions are found.

In shadow mode, declarative validation still runs and mismatches are logged and metered,
but they do not reject requests; hand-written validation stays authoritative.

Enforcement for resources using `WithDeclarativeEnforcement()`:

- No prefix: always enforced, regardless of this gate.
- `+k8s:beta`: enforced when this gate is enabled (the default), otherwise shadowed.
- `+k8s:alpha`: always shadowed.

This gate takes effect independently of the
[`DeclarativeValidation` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidation),
which controls only mismatch reporting.
