---
title: ConstrainedImpersonation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Enables impersonation that is constrained to specific requests instead of being all or nothing.
