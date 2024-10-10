---
title: AnonymousAuthConfigurableEndpoints
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.31"  
    
---
Allows to enable anonymous authentication/authorization for only certain API server endpoints.
