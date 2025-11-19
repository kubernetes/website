---
# Removed from Kubernetes
title: ServiceAccountIssuerDiscovery
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
    toVersion: "1.20"
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.23"

removed: true
---

<!--
Enable OIDC discovery endpoints (issuer and JWKS URLs) for the
service account issuer in the API server. See
[Configure Service Accounts for Pods](/docs/tasks/configure-pod-container/configure-service-account/#service-account-issuer-discovery)
for more details.
-->
在 API 服務器中爲服務賬號頒發者啓用 OIDC 發現端點（頒發者和 JWKS URL）。
詳情參見[爲 Pod 配置服務賬號](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#service-account-issuer-discovery)。
