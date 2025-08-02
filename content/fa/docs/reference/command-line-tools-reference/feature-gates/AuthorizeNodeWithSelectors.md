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
    toVersion: "1.31"
  - stage: beta
    defaultValue: true
    fromVersion: "1.32"
---
کاری کنید که [Node authorizer](/docs/reference/access-authn-authz/node/) از مجوزدهی گزینشگر دقیق استفاده کند.
نیازمند فعال بودن `AuthorizeWithSelectors` است.