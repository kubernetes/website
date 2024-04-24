---
title: KMSv2KDF
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.28"  
    toVersion: "1.28"
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"  
---
Enables KMS v2 to generate single use data encryption keys.
See [Using a KMS Provider for data encryption](/docs/tasks/administer-cluster/kms-provider) for more details.
If the `KMSv2` feature gate is not enabled in your cluster, the value of the `KMSv2KDF` feature gate has no effect.
