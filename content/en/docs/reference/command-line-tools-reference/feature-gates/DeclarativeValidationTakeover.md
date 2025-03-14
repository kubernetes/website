---
title: DeclarativeValidationMismatchMetric
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
---
When enabled, declarative validation errors are returned directly to the caller,
replacing hand-written validation errors for rules that have declarative implementations.
When disabled, hand-written validation errors are always returned, effectively putting
declarative validation in a "shadow mode" that monitors but does not affect API responses.
Note: Although declarative validation aims for functional equivalence with hand-written validation,
the exact number, format, and content of error messages may differ between the two approaches.
