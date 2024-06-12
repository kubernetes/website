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
---

<!--
Enable structured authorization configuration, so that cluster administrators
can specify more than one [authorization webhook](/docs/reference/access-authn-authz/webhook/)
in the API server handler chain.
-->
启用结构化授权配置，以便集群管理员可以在 API
服务器处理程序链中指定多个[授权 Webhook](/zh-cn/docs/reference/access-authn-authz/webhook/)。
