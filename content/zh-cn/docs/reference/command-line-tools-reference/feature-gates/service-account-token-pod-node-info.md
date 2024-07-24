---
title: ServiceAccountTokenPodNodeInfo
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
Controls whether the apiserver embeds the node name and uid
for the associated node when issuing service account tokens bound to Pod objects.
-->
控制 API 服务器在颁发绑定到 Pod 对象的服务账号令牌时，
是否嵌入关联 Node 的名称和 `uid`。
