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
Enable configuring anonymous authentication / authorization for only certain API server endpoints.
-->
允许只对特定 API 服务器端点来配置匿名身份验证/鉴权。