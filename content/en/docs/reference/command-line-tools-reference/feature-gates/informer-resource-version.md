---
title: InformerResourceVersion
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.30"
---
Checks the last synced resource version using the informer.
