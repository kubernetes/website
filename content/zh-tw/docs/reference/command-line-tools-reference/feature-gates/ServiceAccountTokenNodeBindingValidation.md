---
title: ServiceAccountTokenNodeBindingValidation
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
Controls whether the apiserver will validate a Node reference in service account tokens.
-->
控制 API 服務器是否會驗證服務賬號令牌中的 Node 引用。
