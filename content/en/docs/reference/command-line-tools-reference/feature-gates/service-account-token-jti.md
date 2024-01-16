---
title: ServiceAccountTokenJTI
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.29"
---
Controls whether JTIs (UUIDs) are embedded into generated service account tokens,
and whether these JTIs are recorded into the Kubernetes audit log for future requests made by these tokens.
