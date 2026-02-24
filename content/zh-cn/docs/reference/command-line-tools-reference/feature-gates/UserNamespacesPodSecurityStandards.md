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
    toVersion: "1.34"

removed: true
---

<!--
Enable Pod Security Standards policies relaxation for pods
that run with namespaces. You must set the value of this feature gate consistently across all nodes in
your cluster, and you must also enable `UserNamespacesSupport` to use this feature.
-->
启用 Pod 安全标准策略的放宽措施，适用于在命名空间中运行的 Pod。
你需要在集群的所有节点上统一设置此特性门控，并且必须启用 `UserNamespacesSupport` 才能使用此功能。

<!--
This feature gate is not part of Kubernetes v1.35 (and onwards) because,
for those versions of Kubernetes, all supported kubelet versions will fail to
create a pod if it requests a user namespace, but the node does not.
-->
此特性门控不属于 Kubernetes v1.35（及更高版本）的一部分，
因为对于这些版本的 Kubernetes，如果 kubelet 请求用户命名空间，
但节点没有请求，则所有受支持的 kubelet 版本都将无法创建这一 Pod。
