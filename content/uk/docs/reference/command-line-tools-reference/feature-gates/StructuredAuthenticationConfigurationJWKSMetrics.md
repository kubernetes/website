---
title: StructuredAuthenticationConfigurationJWKSMetrics
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---
Вмикає додаткові метрики для операцій JSON Web Key Set (JWKS) в автентифікаторах JWT, налаштованих за допомогою `--authentication-config`. Коли ця опція увімкнена, сервер API записує метрики про останній час отримання JWKS та хеш-значення відповіді JWKS. Детальніше див. [довідку про метрики](/docs/reference/instrumentation/metrics/).
