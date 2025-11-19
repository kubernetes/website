---
# Removed from Kubernetes
title: IngressClassNamespacedParams
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.22"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.24"    

removed: true
---

<!--
Allow namespace-scoped parameters reference in
`IngressClass` resource. This feature adds two fields - `Scope` and `Namespace`
to `IngressClass.spec.parameters`.
-->
允許在 `IngressClass` 資源中使用名字空間範圍的參數引用。
此特性爲 `IngressClass.spec.parameters` 添加了兩個字段：`scope` 和 `namespace`。
