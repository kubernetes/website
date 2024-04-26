---
title: KMSv1
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: true
    fromVersion: "1.28"  
    toVersion: "1.28"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.29"  
    
---
Enables KMS v1 API for encryption at rest. See [Using a KMS Provider for data encryption](/docs/tasks/administer-cluster/kms-provider) for more details.
