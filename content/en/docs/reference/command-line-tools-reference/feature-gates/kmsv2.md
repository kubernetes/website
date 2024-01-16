---
title: KMSv2
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"  
    toVersion: "1.28" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"  
---
Enables KMS v2 API for encryption at rest. See [Using a KMS Provider for data encryption](/docs/tasks/administer-cluster/kms-provider) for more details.
