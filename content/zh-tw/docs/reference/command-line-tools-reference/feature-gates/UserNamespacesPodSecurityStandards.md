---
title: UserNamespacesPodSecurityStandards
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.29"
---

<!--
Enable Pod Security Standards policies relaxation for pods
that run with namespaces. You must set the value of this feature gate consistently across all nodes in
your cluster, and you must also enable `UserNamespacesSupport` to use this feature.
-->
啓用 Pod 安全標準策略的放寬措施，適用於在命名空間中運行的 Pod。
你需要在集羣的所有節點上統一設置此特性門控，並且必須啓用 `UserNamespacesSupport` 才能使用此功能。
