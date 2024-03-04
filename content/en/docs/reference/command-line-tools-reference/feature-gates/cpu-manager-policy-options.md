---
title: CPUManagerPolicyOptions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.22"
  - stage: beta
    defaultValue: true
    fromVersion: "1.23"
---
Allow fine-tuning of CPUManager policies.
