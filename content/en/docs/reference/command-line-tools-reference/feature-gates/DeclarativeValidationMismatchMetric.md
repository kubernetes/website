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
Allow users to additionally run hand-written and declarative validation validations and get any mismatched output by comparing them in the metric - declarative_validation_mismatch.
