---
title: ServiceAccountTokenJTI
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.29"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
---

<!--
Controls whether JTIs (UUIDs) are embedded into generated service account tokens,
and whether these JTIs are recorded into the Kubernetes audit log for future requests made by these tokens.
-->
控制是否将 JTI（UUID）嵌入到生成的服务账号令牌中，
以及对于这些令牌未来的请求，是否将这些 JTI 记录到 Kubernetes 审计日志中。
