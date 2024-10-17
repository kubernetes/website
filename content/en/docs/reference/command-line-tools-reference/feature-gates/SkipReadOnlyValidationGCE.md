---
title: SkipReadOnlyValidationGCE
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: deprecated
    defaultValue: true
    fromVersion: "1.29"  
    toVersion: "1.30"

removed: true
---
Skip validation for GCE, will enable in the
next version.
