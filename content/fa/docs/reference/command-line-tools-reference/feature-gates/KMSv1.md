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
API KMS v1 را برای رمزگذاری در حالت سکون فعال می‌کند. برای جزئیات بیشتر به [Using a KMS Provider for data encryption](/docs/tasks/administer-cluster/kms-provider) مراجعه کنید.