---
title: CPUManagerPolicyAlphaOptions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
---
This allows fine-tuning of CPUManager policies,
experimental, Alpha-quality options
This feature gate guards *a group* of CPUManager options whose quality level is alpha.
This feature gate will never graduate to beta or stable.
