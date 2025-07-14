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
    toVersion: "1.31"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.32"
---
فعال کردن [configurable endpoints for anonymous auth](/docs/reference/access-authn-authz/authentication/#anonymous-authenticator-configuration) برای سرور API.