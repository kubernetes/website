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

<!--
Enable structured authorization configuration, so that cluster administrators
can specify more than one [authorization webhook](/docs/reference/access-authn-authz/webhook/)
in the API server handler chain.
-->
啓用結構化授權配置，以便集羣管理員可以在 API
服務器處理程序鏈中指定多個[授權 Webhook](/zh-cn/docs/reference/access-authn-authz/webhook/)。
