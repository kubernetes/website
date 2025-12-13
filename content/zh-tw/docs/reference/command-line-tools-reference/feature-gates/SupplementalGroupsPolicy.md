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
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---

<!--
Enables support for fine-grained SupplementalGroups control.
For more details, see [Configure fine-grained SupplementalGroups control for a Pod](/content/en/docs/tasks/configure-pod-container/security-context/#supplementalgroupspolicy).
-->
啓用對細粒度 SupplementalGroups 控制的支持。
有關細節請參見[爲 Pod 設定細粒度 SupplementalGroups 控制](/zh-cn/docs/tasks/configure-pod-container/security-context/#supplementalgroupspolicy)。
