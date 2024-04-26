---
title: StructuredAuthorizationConfiguration
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.29"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.30"
---
Enable structured authorization configuration, so that cluster administrators
can specify more than one [authorization webhook](/docs/reference/access-authn-authz/webhook/)
in the API server handler chain.
