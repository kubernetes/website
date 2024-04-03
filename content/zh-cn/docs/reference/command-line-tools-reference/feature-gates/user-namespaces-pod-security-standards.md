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
启用 Pod 安全标准策略的放宽措施，适用于在命名空间中运行的 Pod。
你需要在集群的所有节点上统一设置此特性门控，并且必须启用 `UserNamespacesSupport` 才能使用此功能。