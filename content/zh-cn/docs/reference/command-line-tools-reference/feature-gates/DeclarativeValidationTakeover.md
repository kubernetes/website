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
---

<!--
When enabled, along with the
[DeclarativeValidation](/docs/reference/command-line-tools-reference/feature-gates/DeclarativeValidation.md)
feature gate, declarative validation errors are returned directly to the caller, replacing hand-written validation
errors for rules that have declarative implementations. When disabled (and `DeclarativeValidation` is enabled),
hand-written validation errors are always returned, effectively putting declarative validation in a
__mismatch validation mode__ that monitors but does not affect API responses.
This __mismatch validation mode__  allows for the monitoring of the `declarative_validation_mismatch_total`
and `declarative_validation_panic_total` metrics which are implementation details for a safer rollout,
average user shouldn't need to interact with it directly. This feature gate only operates on the kube-apiserver.
Note: Although declarative validation aims for functional equivalence with hand-written validation,
the exact description of error messages may differ between the two approaches.
-->
启用此特性门控后，若同时启用了
[DeclarativeValidation](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/DeclarativeValidation)
特性门控，具有声明式实现的验证规则将直接返回声明式验证错误，替代手工编写的验证错误。
若此特性门控被禁用（但启用了 `DeclarativeValidation`），则始终返回手工编写的验证错误，
这实际上将声明式验证置于一种**不匹配验证模式（mismatch validation mode）**，此模式仅用于监控，不影响 API 响应。
这种**不匹配验证模式**下，可以监控 `declarative_validation_mismatch_total` 和 `declarative_validation_panic_total`
指标，这是为了实现更安全的特性上线所做的实现细节，普通用户通常无需直接与之交互。此特性门控仅作用于 kube-apiserver。

注意：尽管声明式验证旨在实现与手工编写验证等价的功能，但两者返回的错误消息的确切描述在细节上可能有所不同。
