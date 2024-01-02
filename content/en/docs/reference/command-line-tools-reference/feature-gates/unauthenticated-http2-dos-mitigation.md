---
title: UnauthenticatedHTTP2DOSMitigation
content_type: feature_gate
_build:
  list: never
  render: false
 
stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29" 
---
Enables HTTP/2 Denial of Service (DoS) mitigations for unauthenticated clients.
Kubernetes v1.28.0 through v1.28.2 do not include this feature gate.
