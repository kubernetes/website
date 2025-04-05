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
Вмикає точки доступу OIDC discovery (URL видачі та JWKS) для видачі службових облікових записів в API-сервері. Див. [Налаштування службових облікових записів для контейнерів Pod](/docs/tasks/configure-pod-container/configure-service-account/#service-account-issuer-discovery) для отримання додаткових відомостей.
