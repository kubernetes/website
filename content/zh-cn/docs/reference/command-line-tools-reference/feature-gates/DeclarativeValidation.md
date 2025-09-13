---
title: DeclarativeValidation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---

<!--
Enables declarative validation of in-tree Kubernetes APIs. When enabled, APIs with declarative validation rules
(defined using IDL tags in the Go code) will have both the generated declarative validation code and the original
hand-written validation code executed.  The results are compared, and any discrepancies are reported via the
`declarative_validation_mismatch_total` metric.  Only the hand-written validation result is returned to the user
(eg: actually validates in the request path).  The original hand-written validation are still the authoritative
validations when this is enabled but this can be changed if the
[DeclarativeValidationTakeover feature gate](/docs/reference/command-line-tools-reference/feature-gates/DeclarativeValidationTakeover.md)
is enabled in addition to this gate.  This feature gate only operates on the kube-apiserver.
-->
启用树内 Kubernetes API 的声明式验证。启用后，具有声明式验证规则（使用 Go 代码中的 IDL 标签定义）的
API 将同时执行所生成的声明式验证代码和原来手工编写的验证代码。两者的结果将进行比较，任何不一致都会通过
`declarative_validation_mismatch_total` 指标进行报告。
返回给用户的仅是手工编写验证的结果（也就是说，实际在请求路径中起到验证作用者）。
在启用此特性门控时，原来手工编写的验证逻辑仍然是权威的验证方式，但如果同时启用了
[DeclarativeValidationTakeover 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/DeclarativeValidationTakeover)，
将发生变化。此特性门控仅作用于 kube-apiserver。
