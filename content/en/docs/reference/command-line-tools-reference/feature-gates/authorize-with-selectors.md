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
Allows authorization to use field and label selectors.
Enables `fieldSelector` and `labelSelector` fields in the [SubjectAccessReview API](/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/),
passes field and label selector information to [authorization webhooks](/docs/reference/access-authn-authz/webhook/),
enables `fieldSelector` and `labelSelector` functions in the [authorizer CEL library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors),
and enables checking `fieldSelector` and `labelSelector` fields in [authorization webhook `matchConditions`](/docs/reference/access-authn-authz/authorization/#using-configuration-file-for-authorization).