---
title: OpenAPIV3
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.23"
  - stage: beta
    defaultValue: true
    fromVersion: "1.24"  
    toVersion: "1.26" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.27"  
    toVersion: "1.28" 
removed: true
---
Enables the API server to publish OpenAPI v3.
