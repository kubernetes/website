---
title: SupplementalGroupsPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.31"
---

<!--
Enables support for fine-grained SupplementalGroups control.
For more details, see [Configure fine-grained SupplementalGroups control for a Pod](/content/en/docs/tasks/configure-pod-container/security-context/#supplementalgroupspolicy).
-->
启用对细粒度 SupplementalGroups 控制的支持。
有关细节请参见[为 Pod 配置细粒度 SupplementalGroups 控制](/zh-cn/docs/tasks/configure-pod-container/security-context/#supplementalgroupspolicy)。
