---
title: StructuredAuthenticationConfiguration
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
    toVersion: "1.33"
  - stage: stable
    locked: true
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Enable [structured authentication configuration](/docs/reference/access-authn-authz/authentication/#configuring-the-api-server)
for the API server.
-->
爲 API 服務器啓用[結構化身份驗證配置](/zh-cn/docs/reference/access-authn-authz/authentication/#configuring-the-api-server)。
