---
title: AnonymousAuthConfigurableEndpoints
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
    locked: true
---

<!--
Enable [configurable endpoints for anonymous auth](/docs/reference/access-authn-authz/authentication/#anonymous-authenticator-configuration)
for the API server.
-->
允许对 API 服务器启用[匿名身份验证的可配置端点](/zh-cn/docs/reference/access-authn-authz/authentication/#anonymous-authenticator-configuration)。
