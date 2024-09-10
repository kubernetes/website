---
title: AnonymousAuthConfigurableEndpoints
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.31"
---
Enable [configurable endpoints for anonymous auth](/docs/reference/access-authn-authz/authentication/#anonymous-authenticator-onfiguration) 
for the API server.
