---
title: TopologyManagerPolicyBetaOptions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.27"
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
---
Allow fine-tuning of topology manager policies,
experimental, Beta-quality options.
This feature gate guards *a group* of topology manager options whose quality level is beta.
This feature gate will never graduate to stable.
