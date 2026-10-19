---
title: TopologyManagerPolicyAlphaOptions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.26"
---
Allow fine-tuning of topology manager policies,
experimental, Alpha-quality options.
This feature gate guards *a group* of topology manager options whose quality level is alpha.
This feature gate will never graduate to beta or stable.
