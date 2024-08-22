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
---

<!--
Allows authorization to use field and label selectors.
Enables `fieldSelector` and `labelSelector` fields in the [SubjectAccessReview API](/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/),
passes field and label selector information to [authorization webhooks](/docs/reference/access-authn-authz/webhook/),
enables `fieldSelector` and `labelSelector` functions in the [authorizer CEL library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors),
and enables checking `fieldSelector` and `labelSelector` fields in [authorization webhook `matchConditions`](/docs/reference/access-authn-authz/authorization/#using-configuration-file-for-authorization).
-->
允许授权使用字段和标签选择算符。
启用 [SubjectAccessReview API](/zh-cn/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/)
中的 `fieldSelector` 和 `labelSelector` 字段，
将字段和标签选择算符信息传递给[授权 Webhook](/zh-cn/docs/reference/access-authn-authz/webhook/)，
启用[授权程序 CEL 库](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors)中的
`fieldSelector` 和 `labelSelector` 特性，
并允许在[授权 Webhook `matchConditions`](/zh-cn/docs/reference/access-authn-authz/authorization/#using-configuration-file-for-authorization)
中检查 `fieldSelector` 和 `labelSelector` 字段。
