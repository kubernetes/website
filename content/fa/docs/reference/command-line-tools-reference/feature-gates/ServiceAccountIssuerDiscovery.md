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
نقاط پایانی کشف OIDC (URL های صادرکننده و JWKS) را برای صادرکننده حساب سرویس در سرور API فعال کنید. برای جزئیات بیشتر به [Configure Service Accounts for Pods](/docs/tasks/configure-pod-container/configure-service-account/#service-account-issuer-discovery) مراجعه کنید.