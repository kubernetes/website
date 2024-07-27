---
title: ServiceAccountTokenNodeBinding
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.29"
---
<!--
Controls whether the apiserver allows binding service account tokens to Node objects.
-->
控制 API 服务器是否允许将服务账号令牌绑定到 Node 对象。
