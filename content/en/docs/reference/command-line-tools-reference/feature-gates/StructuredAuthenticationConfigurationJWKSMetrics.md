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
Enables additional metrics for JSON Web Key Set (JWKS) operations in JWT authenticators
configured via `--authentication-config`. When enabled, the API server records metrics about
the last time JWKS was fetched and the hash value of the JWKS response.
See the [metrics reference](/docs/reference/instrumentation/metrics/) for details.
