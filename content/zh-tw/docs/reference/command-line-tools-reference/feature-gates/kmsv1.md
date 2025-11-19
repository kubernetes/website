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

<!--
Enables KMS v1 API for encryption at rest. See
[Using a KMS Provider for data encryption](/docs/tasks/administer-cluster/kms-provider)
for more details.
-->
啓用 KMS v1 API 以實現靜態加密。
詳情參見[使用 KMS 驅動進行數據加密](/zh-cn/docs/tasks/administer-cluster/kms-provider/)。
