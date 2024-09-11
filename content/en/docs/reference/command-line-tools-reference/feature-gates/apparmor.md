---
title: AppArmor
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.4"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
---
Enable use of AppArmor mandatory access control for Pods running on Linux nodes.
See [AppArmor Tutorial](/docs/tutorials/security/apparmor/) for more details.
