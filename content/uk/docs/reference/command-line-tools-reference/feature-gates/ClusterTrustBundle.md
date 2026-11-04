---
title: ClusterTrustBundle
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.32"
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.36"
  - stage: stable
    defaultValue: true
    fromVersion: "1.37"
---
Ця функціональна можливість існує в API-сервері Kubernetes та в менеджері контролерів.

Використовуючи kube-apiserver, вона дозволяє підтримку ClusterTrustBundle.

У менеджері контролерів Kubernetes вона використовується для керування публікацією ClusterTrustBundle для підписувача `kubernetes.io/kube-apiserver-serving`.
