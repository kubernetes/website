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
Дозволяє використовувати селектори полів та міток для авторизації. Увімкнення полів `fieldSelector` та `labelSelector` в [API SubjectAccessReview](/uk/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/), передає інформацію про селектори полів і міток до [вебхуків авторизації](/uk/docs/reference/access-authn-authz/webhook/), активує функції `fieldSelector` та `labelSelector` у [бібліотеці CEL для авторизації](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors), а також дозволяє перевіряти поля `fieldSelector` і `labelSelector` в [умовах збігу вебхуків авторизації](/uk/docs/reference/access-authn-authz/authorization/#using-configuration-file-for-authorization).
