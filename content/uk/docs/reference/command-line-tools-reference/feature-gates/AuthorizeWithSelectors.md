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

Дозволяє використовувати селектори полів та міток для авторизації. Увімкнення полів `fieldSelector` та `labelSelector` в [API SubjectAccessReview](/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/), передає інформацію про селектори полів і міток до [вебхуків авторизації](/docs/reference/access-authn-authz/webhook/), активує функції `fieldSelector` та `labelSelector` у [бібліотеці CEL для авторизації](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors), а також дозволяє перевіряти поля `fieldSelector` і `labelSelector` в [умовах збігу вебхуків авторизації](/docs/reference/access-authn-authz/authorization/#using-configuration-file-for-authorization).
