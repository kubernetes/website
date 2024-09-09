---
title: AppArmorFields
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
---
Enable AppArmor related security context settings.
See [AppArmor Tutorial](/docs/tutorials/security/apparmor/) for more details.
