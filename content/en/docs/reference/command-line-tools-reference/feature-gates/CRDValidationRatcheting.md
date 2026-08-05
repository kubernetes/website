---
title: CRDValidationRatcheting
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.29"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    fromVersion: "1.33"
---
Enable updates to custom resources to contain
violations of their OpenAPI schema if the offending portions of the resource
update did not change. See [Validation Ratcheting](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-ratcheting) for more details.

