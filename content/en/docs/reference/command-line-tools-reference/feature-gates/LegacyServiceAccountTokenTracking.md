---
title: LegacyServiceAccountTokenTracking
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.26"  
    toVersion: "1.26" 
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"  
    toVersion: "1.27" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.28"  
    toVersion: "1.29" 
removed: true
---
Track usage of Secret-based
[service account tokens](/docs/concepts/security/service-accounts/#get-a-token).
