---
title: CPUManagerPolicyBetaOptions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.23"
---
This allows fine-tuning of CPUManager policies,
experimental, Beta-quality options
This feature gate guards *a group* of CPUManager options whose quality level is beta.
This feature gate will never graduate to stable.
