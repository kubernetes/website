---
# Removed from Kubernetes
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
    toVersion: "1.29"
removed: true
---

<!--
Activate the `SelfSubjectReview` API which allows users
to see the requesting subject's authentication information.
See [API access to authentication information for a client](/docs/reference/access-authn-authz/authentication/#self-subject-review)
for more details.
-->
激活 `SelfSubjectReview` API，允許使用者查看請求主體的身份認證資訊。
更多細節請參閱 [API 訪問客戶端的身份認證資訊](/zh-cn/docs/reference/access-authn-authz/authentication/#self-subject-review)。
