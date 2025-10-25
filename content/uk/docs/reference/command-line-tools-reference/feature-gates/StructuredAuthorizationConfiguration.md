---
title: StructuredAuthorizationConfiguration
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.29"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
---

Вмикає структуровану конфігурацію авторизації, щоб адміністратори кластера могли вказати більше одного [webhook авторизації](/docs/reference/access-authn-authz/webhook/) в ланцюжку обробників серверів API.
