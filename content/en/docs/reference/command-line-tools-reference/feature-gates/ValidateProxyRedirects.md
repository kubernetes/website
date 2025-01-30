---
# Removed from Kubernetes
title: ValidateProxyRedirects
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.12"
    toVersion: "1.13"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.14"
    toVersion: "1.21"    
  - stage: deprecated 
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.24"

removed: true
---
This flag controls whether the API server should validate that redirects
are only followed to the same host. Only used if the `StreamingProxyRedirects` flag is enabled.
