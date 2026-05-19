---
title: ConditionalAuthorization
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Allows authorizers to return conditional responses where the final authorization decision depends on the content of the API request or stored object.
See [Conditional authorization](/docs/reference/access-authn-authz/authorization/#conditional-authorization) for more details.
