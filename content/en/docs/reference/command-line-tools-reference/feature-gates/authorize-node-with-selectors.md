---
title: AuthorizeNodeWithSelectors
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.31"
---
Make the [Node authorizer](/docs/reference/access-authn-authz/node/) use fine-grained selector authorization.
Requires `AuthorizeWithSelectors` to be enabled.
