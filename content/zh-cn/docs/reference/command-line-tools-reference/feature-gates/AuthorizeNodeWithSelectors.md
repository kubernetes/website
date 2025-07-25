---
title: AuthorizeNodeWithSelectors
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
Make the [Node authorizer](/docs/reference/access-authn-authz/node/) use fine-grained selector authorization.
Requires `AuthorizeWithSelectors` to be enabled.
-->
允许[节点鉴权器](/zh-cn/docs/reference/access-authn-authz/node/)使用细粒度选择算符鉴权。
需要启用 `AuthorizeWithSelectors`。
