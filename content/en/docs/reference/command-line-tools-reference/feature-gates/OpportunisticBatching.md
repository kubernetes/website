---
title: OpportunisticBatching
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---
Enable reusing of scheduling results from the previous scheduling cycle for equivalent pods.
