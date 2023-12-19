---
title: ServiceAccountTokenNodeBinding
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.29"
---
Controls whether the apiserver allows binding service account tokens to Node objects.
