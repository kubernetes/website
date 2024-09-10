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
---

<!--
Enable [structured authentication configuration](/docs/reference/access-authn-authz/authentication/#configuring-the-api-server) 
for the API server.
-->
为 API 服务器启用[结构化身份验证配置](/zh-cn/docs/reference/access-authn-authz/authentication/#configuring-the-api-server)。
