---
title: ServerSideFieldValidation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.24"
  - stage: beta
    defaultValue: true
    fromVersion: "1.25"  
    toVersion: "1.26" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.27"  
    toVersion: "1.31"

removed: true
---

<!--
Enables server-side field validation. This means the validation
of resource schema is performed at the API server side rather than the client side
(for example, the `kubectl create` or `kubectl apply` command line).
-->
啓用服務器端字段驗證。這意味着資源模式的驗證發生在 API 服務器端而不是客戶端
（例如，`kubectl create` 或 `kubectl apply` 命令行）。
