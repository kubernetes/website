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
---
Дозволяє [авторизатору вузла](/uk/docs/reference/access-authn-authz/node/) використовувати детальну авторизацію за допомогою селекторів. Потрібно увімкнути `AuthorizeWithSelectors`.
