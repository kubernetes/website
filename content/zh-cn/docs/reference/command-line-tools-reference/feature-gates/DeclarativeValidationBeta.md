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
The global safety switch for Beta validation rules (`+k8s:beta`). Disable it to revert
those rules to shadow mode if regressions are found.
-->
Beta 阶段验证规则（`+k8s:beta`）的全局安全开关。如果发现这些规则引入了问题，
可以禁用它以使这些规则恢复为影子模式。

<!--
In shadow mode, declarative validation still runs and mismatches are logged and metered,
but they do not reject requests; hand-written validation stays authoritative.
-->
在影子模式下，声明式验证仍然运行，不匹配之处会被记录到日志并计入指标，
但不会拒绝请求；手写验证仍然是权威的。

<!--
Enforcement for resources using `WithDeclarativeEnforcement()`:
-->
对于使用 `WithDeclarativeEnforcement()` 的资源，各类规则的生效情况如下：

<!--
- No prefix: always enforced, regardless of this gate.
- `+k8s:beta`: enforced when this gate is enabled (the default), otherwise shadowed.
- `+k8s:alpha`: always shadowed.
-->
- 无前缀：始终生效，与此门控无关。
- `+k8s:beta`：当此门控启用时（默认）生效，否则处于影子模式。
- `+k8s:alpha`：始终处于影子模式。

<!--
This gate takes effect independently of the
[`DeclarativeValidation` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidation),
which controls only mismatch reporting.
-->
此门控独立于
[`DeclarativeValidation` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidation)生效，
后者仅控制不匹配的报告。
