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

<!--
Enables additional metrics for JSON Web Key Set (JWKS) operations in JWT authenticators
configured via `--authentication-config`. When enabled, the API server records metrics about
the last time JWKS was fetched and the hash value of the JWKS response.
See the [metrics reference](/docs/reference/instrumentation/metrics/) for details.
-->
在通过 `--authentication-config` 配置的 JWT 认证组件中启用 JSON Web Key Set (JWKS) 操作的额外指标。
启用后，API 服务器会记录上次获取 JWKS 的时间以及 JWKS 响应的哈希值。
有关细节参阅[指标参考](/zh-cn/docs/reference/instrumentation/metrics/)。
