---
# Removed from Kubernetes
title: ConfigurableFSGroupPolicy
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.18"
    toVersion: "1.19"
  - stage: beta
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.22"
  - stage: stable
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.25"

removed: true
---
Дозволяє користувачеві налаштувати політику зміни дозволів на томи для fsGroups під час монтування тому в Pod. Див. [Налаштування політики зміни дозволів на томи та права власності для Podʼів](/docs/tasks/configure-pod-container/security-context/#configure-volume-permission-and-ownership-change-policy-for-pods) для більш детальної інформації.
