---
title: ConstrainedImpersonation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    locked: false
    fromVersion: "1.35"
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    locked: false
    fromVersion: "1.36"
---

Enables impersonation that is constrained to specific requests instead of being all or nothing.
