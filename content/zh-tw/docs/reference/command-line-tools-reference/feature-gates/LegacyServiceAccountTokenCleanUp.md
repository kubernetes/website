---
title: LegacyServiceAccountTokenCleanUp
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.29"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"

removed: true
---

<!--
Enable cleaning up Secret-based
[service account tokens](/docs/concepts/security/service-accounts/#get-a-token)
when they are not used in a specified time (default to be one year).
-->
當服務賬號令牌在指定時間內（預設爲一年）未被使用時，
允許基於 Secret 清理[服務賬號令牌](/zh-cn/docs/concepts/security/service-accounts/#get-a-token)。
