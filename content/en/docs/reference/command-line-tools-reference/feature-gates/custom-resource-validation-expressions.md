---
title: CustomResourceValidationExpressions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.24"
  - stage: beta
    defaultValue: true
    fromVersion: "1.25"  
    toVersion: "1.28" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.30"
    
removed: true 
---
Enable expression language validation in CRD
which will validate customer resource based on validation rules written in
the `x-kubernetes-validations` extension.
