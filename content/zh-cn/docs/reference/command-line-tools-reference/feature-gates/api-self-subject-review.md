---
title: APISelfSubjectReview
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"  
    toVersion: "1.27" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.28" 
---

<!--
Activate the `SelfSubjectReview` API which allows users
to see the requesting subject's authentication information.
See [API access to authentication information for a client](/docs/reference/access-authn-authz/authentication/#self-subject-review)
for more details.
-->
激活 `SelfSubjectReview` API，允许用户查看请求主体的身份认证信息。
更多细节请参阅 [API 访问客户端的身份认证信息](/zh-cn/docs/reference/access-authn-authz/authentication/#self-subject-review)。
