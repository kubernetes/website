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
在 API 服务器中为服务账号颁发者启用 OIDC 发现端点（颁发者和 JWKS URL）。
详情参见[为 Pod 配置服务账号](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#service-account-issuer-discovery)。
