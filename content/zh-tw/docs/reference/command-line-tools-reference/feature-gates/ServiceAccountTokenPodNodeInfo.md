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
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
---

<!--
Controls whether the apiserver embeds the node name and uid
for the associated node when issuing service account tokens bound to Pod objects.
-->
控制 API 伺服器在頒發綁定到 Pod 對象的服務賬號令牌時，
是否嵌入關聯 Node 的名稱和 `uid`。
