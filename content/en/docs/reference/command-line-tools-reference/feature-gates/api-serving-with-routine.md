---
title: APIServingWithRoutine
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
---
This enables an optimization for the API server where **watch** responses
can be served by a dedicated goroutine.
