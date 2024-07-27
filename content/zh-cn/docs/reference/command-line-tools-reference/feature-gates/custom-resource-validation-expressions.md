---
title: CustomResourceValidationExpressions
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
    toVersion: "1.28" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"  
---
<!--
Enable expression language validation in CRD
which will validate customer resource based on validation rules written in
the `x-kubernetes-validations` extension.
-->
启用 CRD 中的表达式语言合法性检查，
基于 `x-kubernetes-validations` 扩展中所书写的合法性检查规则来验证定制资源。
