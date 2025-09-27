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
Дозволяє посилатися на параметри в межах простору імен у ресурсі `IngressClass`. Ця можливість додає два поля — `Scope` та `Namespace` до `IngressClass.spec.parameters`.
