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
啓用樹內 Kubernetes API 的聲明式驗證。啓用後，具有聲明式驗證規則（使用 Go 代碼中的 IDL 標籤定義）的
API 將同時執行所生成的聲明式驗證代碼和原來手工編寫的驗證代碼。兩者的結果將進行比較，任何不一致都會通過
`declarative_validation_mismatch_total` 指標進行報告。
返回給用戶的僅是手工編寫驗證的結果（也就是說，實際在請求路徑中起到驗證作用者）。
在啓用此特性門控時，原來手工編寫的驗證邏輯仍然是權威的驗證方式，但如果同時啓用了
[DeclarativeValidationTakeover 特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/DeclarativeValidationTakeover)，
將發生變化。此特性門控僅作用於 kube-apiserver。
