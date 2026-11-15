---
title: DeclarativeValidationTakeover
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.35"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.36"
    toVersion: "1.36"
  - stage: deprecated
    defaultValue: false
    locked: true
    fromVersion: "1.37"
---
<!--
Deprecated: replaced by the
[`DeclarativeValidationBeta` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidationBeta).
-->
已弃用：由
[`DeclarativeValidationBeta` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidationBeta)取代。

<!--
Before Kubernetes v1.36, this gate made declarative validation errors authoritative,
replacing the hand-written errors for rules that had a declarative implementation.
-->
在 Kubernetes v1.36 之前，此门控使声明式验证错误成为权威结果，
对于具有声明式实现的规则，用其替代手写验证错误。

<!--
The API server no longer honors this gate. Use `DeclarativeValidationBeta` instead to
control whether `+k8s:beta` rules are enforced.
-->
API 服务器不再理会此门控。请改用 `DeclarativeValidationBeta`
来控制 `+k8s:beta` 规则是否生效。

<!--
This feature gate only operates on the `kube-apiserver` component.
-->
此特性门控仅作用于 `kube-apiserver` 组件。
