---
title: CRDValidationRatcheting
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.29"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    fromVersion: "1.33"
---

<!--
Enable updates to custom resources to contain
violations of their OpenAPI schema if the offending portions of the resource
update did not change. See [Validation Ratcheting](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-ratcheting) for more details.
-->
如果資源更新的衝突部分未發生變化，則啓用對自定義資源的更新以包含對 OpenAPI 模式的違規條目。
詳情參見[驗證遞進](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-ratcheting)。
