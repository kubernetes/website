---
title: AnonymousAuthConfigurableEndpoints
content_type: feature_gate
build:
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
    locked: true
---

Дозволяє налаштовувати [точки доступу для анонімної автентифікації](/docs/reference/access-authn-authz/authentication/#anonymous-authenticator-configuration) на сервері API.
