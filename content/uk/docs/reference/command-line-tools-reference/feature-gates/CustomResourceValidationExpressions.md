---
title: CustomResourceValidationExpressions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.24"
  - stage: beta
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.28"
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.30"

removed: true
---
Вмикає перевірку мови виразів у CRD, яка буде перевіряти власний ресурс клієнта на основі правил валідації, написаних у розширенні `x-kubernetes-validations`.
