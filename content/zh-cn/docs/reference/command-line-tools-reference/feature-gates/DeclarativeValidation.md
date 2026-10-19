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
    toVersion: "1.35"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.36"
---
<!--
Reports differences between declarative validation of in-tree Kubernetes APIs and the
equivalent hand-written validation.
-->
报告树内 Kubernetes API 的声明式验证与等价的手写验证之间的差异。

<!--
When enabled, rules marked `+k8s:alpha` or `+k8s:beta` run alongside the hand-written
validation, and the API server logs any discrepancy and counts it in the
`declarative_validation_mismatch_total` metric.
-->
启用后，标记为 `+k8s:alpha` 或 `+k8s:beta` 的规则会与手写验证并行运行，
API 服务器会记录所有不一致之处，并通过 `declarative_validation_mismatch_total` 指标进行计数。

<!--
This gate controls only reporting, not which result the API server returns. Enforcement
is:
-->
此门控仅控制是否报告，不控制 API 服务器返回哪个结果。各类规则的生效情况如下：

<!--
- No prefix: always enforced.
- `+k8s:beta`: enforced when the
  [`DeclarativeValidationBeta` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidationBeta)
  is enabled (the default).
- `+k8s:alpha`: never enforced.
-->
- 无前缀：始终生效。
- `+k8s:beta`：当
  [`DeclarativeValidationBeta` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidationBeta)
  启用时（默认）生效。
- `+k8s:alpha`：从不生效。

<!--
This feature gate only operates on the `kube-apiserver` component.
-->
此特性门控仅作用于 `kube-apiserver` 组件。
