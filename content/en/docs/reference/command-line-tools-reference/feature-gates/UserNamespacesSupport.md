---
title: UserNamespacesSupport
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    locked: false
    fromVersion: "1.25"
    toVersion: "1.29"
  - stage: beta
    defaultValue: false
    locked: false
    fromVersion: "1.30"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    locked: false
    fromVersion: "1.33"
    toVersion: "1.35"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.36"
---

Enable user namespace support for Pods.
