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
    toVersion: "1.33"
  - stage: beta
    defaultValue: false
    fromVersion: "1.34"
---

<!--
Enable [MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/) support, which allows
[CEL](/docs/reference/using-api/cel/) mutations to
be applied during admission control.

For Kubernetes v1.30 and v1.31, this feature gate existed but had no effect.
-->
启用 [MutatingAdmissionPolicy](/zh-cn/docs/reference/access-authn-authz/mutating-admission-policy/)
支持，允许在准入控制中应用 [CEL](/zh-cn/docs/reference/using-api/cel/) 变更。

对于 Kubernetes v1.30 和 v1.31，此特性门控存在但不起作用。
