---
title: DeclarativeValidationBeta
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---

<!--
This feature gate acts as the Global Safety Switch for Beta-stage validation rules (`+k8s:beta`).
It allows cluster admins to disable enforcement for validations in the Beta stage if
regressions are found, forcing them back to Shadow mode.
-->
此特性门控充当 Beta 阶段验证规则（`+k8s:beta`）的全局安全开关。
如果发现回归问题，它允许集群管理员禁用 Beta 阶段的验证强制执行，
强制它们返回 Shadow 模式。

<!--
In Shadow mode, declarative validation is executed and mismatches against handwritten
validation are logged as metrics, but failures do not reject requests.
Handwritten validation remains authoritative and enforced.
-->
在 Shadow 模式下，声明式验证会执行，与手写验证的不匹配会作为指标记录，
但失败不会拒绝请求。
手写验证仍然是权威的并强制执行。

<!--
Enforcement logic for resources using `WithDeclarativeEnforcement()`:
- Standard tags (no prefix): Always Enforced (Bypasses this gate).
- Beta tags (`+k8s:beta`): Enforced when this gate is enabled (default), otherwise Shadowed.
- Alpha tags (`+k8s:alpha`): Always Shadowed.

This gate has no effect if the master `DeclarativeValidation` feature gate is disabled.
-->
使用 `WithDeclarativeEnforcement()` 的资源的强制执行逻辑：

- 标准标签（无前缀）：始终强制执行（绕过此门控）。
- Beta 标签（`+k8s:beta`）：当此门控启用时强制执行（默认），否则为 Shadow 模式。
- Alpha 标签（`+k8s:alpha`）：始终为 Shadow 模式。

如果主 `DeclarativeValidation` 特性门控被禁用，此门控无效。

