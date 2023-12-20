---
# Removed from Kubernetes
title: IngressClassNamespacedParams
content_type: feature_gate

_build:
  list: never
  render: false
---

<!--
Allow namespace-scoped parameters reference in
`IngressClass` resource. This feature adds two fields - `Scope` and `Namespace`
to `IngressClass.spec.parameters`.
-->
允许在 `IngressClass` 资源中使用名字空间范围的参数引用。
此特性为 `IngressClass.spec.parameters` 添加了两个字段：`scope` 和 `namespace`。
