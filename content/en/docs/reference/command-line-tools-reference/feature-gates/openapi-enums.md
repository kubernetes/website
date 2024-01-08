---
title: OpenAPIEnums
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.23"
  - stage: beta
    defaultValue: true
    fromVersion: "1.24"
---
Enables populating "enum" fields of OpenAPI schemas in the
spec returned from the API server.
