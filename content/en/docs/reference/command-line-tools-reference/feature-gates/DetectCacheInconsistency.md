---
title: DetectCacheInconsistency
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---
Enable cache inconsistency detection in the API server.
