---
title: AuthorizeWithSelectors
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.31"
    toVersion: "1.31"
  - stage: beta
    defaultValue: true
    fromVersion: "1.32"
    toVersion: "1.33"
  - stage: stable
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Allows authorization to use field and label selectors.
Enables `fieldSelector` and `labelSelector` fields in the [SubjectAccessReview API](/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/),
passes field and label selector information to [authorization webhooks](/docs/reference/access-authn-authz/webhook/),
enables `fieldSelector` and `labelSelector` functions in the [authorizer CEL library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors),
and enables checking `fieldSelector` and `labelSelector` fields in [authorization webhook `matchConditions`](/docs/reference/access-authn-authz/authorization/#using-configuration-file-for-authorization).
-->
允許授權使用字段和標籤選擇算符。
啓用 [SubjectAccessReview API](/zh-cn/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/)
中的 `fieldSelector` 和 `labelSelector` 字段，
將字段和標籤選擇算符資訊傳遞給[授權 Webhook](/zh-cn/docs/reference/access-authn-authz/webhook/)，
啓用[授權程式 CEL 庫](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors)中的
`fieldSelector` 和 `labelSelector` 特性，
並允許在[授權 Webhook `matchConditions`](/zh-cn/docs/reference/access-authn-authz/authorization/#using-configuration-file-for-authorization)
中檢查 `fieldSelector` 和 `labelSelector` 字段。
