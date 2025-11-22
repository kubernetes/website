---
title: StaleControllerConsistency
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.35"
---

Enable certain KCM controllers to wait for their cache to catch up before requeueing.