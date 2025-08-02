---
title: AuthorizeNodeWithSelectors
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
---

Дозволяє [авторизатору вузла](/docs/reference/access-authn-authz/node/) використовувати детальну авторизацію за допомогою селекторів. Потрібно увімкнути `AuthorizeWithSelectors`.
