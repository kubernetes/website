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
啓用此特性門控後，若同時啓用了
[DeclarativeValidation](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/DeclarativeValidation)
特性門控，具有聲明式實現的驗證規則將直接返回聲明式驗證錯誤，替代手工編寫的驗證錯誤。
若此特性門控被禁用（但啓用了 `DeclarativeValidation`），則始終返回手工編寫的驗證錯誤，
這實際上將聲明式驗證置於一種**不匹配驗證模式（mismatch validation mode）**，此模式僅用於監控，不影響 API 響應。
這種**不匹配驗證模式**下，可以監控 `declarative_validation_mismatch_total` 和 `declarative_validation_panic_total`
指標，這是爲了實現更安全的特性上線所做的實現細節，普通用戶通常無需直接與之交互。此特性門控僅作用於 kube-apiserver。

注意：儘管聲明式驗證旨在實現與手工編寫驗證等價的功能，但兩者返回的錯誤消息的確切描述在細節上可能有所不同。
