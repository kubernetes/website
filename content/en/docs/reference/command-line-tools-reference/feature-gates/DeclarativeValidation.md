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
Enables running declarative validation of APIs, where declared. When enabled, APIs with
declarative validation rules will validate objects using the generated
declarative validation code and compare the results to the regular imperative validation.
See DeclarativeValidationTakeover for more.