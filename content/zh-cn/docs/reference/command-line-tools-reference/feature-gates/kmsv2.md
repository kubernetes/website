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

<!--
Enables KMS v2 API for encryption at rest. See [Using a KMS Provider for data encryption](/docs/tasks/administer-cluster/kms-provider) for more details.
-->
启用 KMS v2 API 以实现静态加密。
详情参见[使用 KMS 驱动进行数据加密](/zh-cn/docs/tasks/administer-cluster/kms-provider/)。
