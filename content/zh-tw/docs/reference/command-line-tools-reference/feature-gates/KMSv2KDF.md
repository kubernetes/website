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
    toVersion: "1.31"

removed: true
---

<!--
Enables KMS v2 to generate single use data encryption keys.
See [Using a KMS Provider for data encryption](/docs/tasks/administer-cluster/kms-provider) for more details.
If the `KMSv2` feature gate is not enabled in your cluster, the value of the `KMSv2KDF` feature gate has no effect.
-->
啓用 KMS v2 以生成一次性數據加密密鑰。
詳情參見[使用 KMS 驅動進行數據加密](/zh-cn/docs/tasks/administer-cluster/kms-provider/)。
如果 `KMSv2` 特性門控在你的集羣未被啓用，則 `KMSv2KDF` 特性門控的值不會產生任何影響。
