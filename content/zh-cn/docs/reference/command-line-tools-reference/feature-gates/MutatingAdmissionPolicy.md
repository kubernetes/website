---
title: MutatingAdmissionPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.30"
---

<!--
Enable [MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/) support for [CEL](https://kubernetes.io/docs/reference/using-api/cel/) mutations be used in admission control.

For Kubernetes v1.30 and v1.31, this feature gate existed but had no effect.
-->
为准入控制中使用的 [CEL](/zh-cn/docs/reference/using-api/cel/) 变更启用
[MutatingAdmissionPolicy](/zh-cn/docs/reference/access-authn-authz/mutating-admission-policy/)
支持。

对于 Kubernetes v1.30 和 v1.31，此特性门控存在但不起作用。
