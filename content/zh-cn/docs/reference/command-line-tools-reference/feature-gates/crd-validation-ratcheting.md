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
---

<!--
Enable updates to custom resources to contain
violations of their OpenAPI schema if the offending portions of the resource
update did not change. See [Validation Ratcheting](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-ratcheting) for more details.
-->
如果资源更新的冲突部分未发生变化，则启用对自定义资源的更新以包含对 OpenAPI 模式的违规条目。
详情参见[验证递进](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-ratcheting)。
