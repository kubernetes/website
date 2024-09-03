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
---

<!--
Enable [configurable endpoints for anonymous auth](/docs/reference/access-authn-authz/authentication/#anonymous-authenticator-configuration)
for the API server.
-->
为 API 服务器启用[可配置的匿名身份认证端点](/zh-cn/docs/reference/access-authn-authz/authentication/#anonymous-authenticator-configuration)。
