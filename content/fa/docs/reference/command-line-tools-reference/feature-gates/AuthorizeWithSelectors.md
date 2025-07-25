---
title: AuthorizeWithSelectors
content_type: feature_gate
_build:
  list: beta
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.31"
    toVersion: "1.31"
  - stage: beta
    defaultValue: true
    fromVersion: "1.32"
---
اجازه استفاده از انتخابگرهای فیلد و برچسب را به مجوزدهنده می‌دهد.
فیلدهای `fieldSelector` و `labelSelector` را در [SubjectAccessReview API](/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/) فعال می‌کند،
اطلاعات انتخابگر فیلد و برچسب را به [authorization webhooks](/docs/reference/access-authn-authz/webhook/) ارسال می‌کند،
توابع `fieldSelector` و `labelSelector` را در [authorizer CEL library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors) فعال می‌کند،
و بررسی فیلدهای `fieldSelector` و `labelSelector` را در [authorization webhook `matchConditions`](/docs/reference/access-authn-authz/authorization/#using-configuration-file-for-authorization).