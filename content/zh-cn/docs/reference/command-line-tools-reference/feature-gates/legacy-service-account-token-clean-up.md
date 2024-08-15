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
---

<!--
Enable cleaning up Secret-based
[service account tokens](/docs/concepts/security/service-accounts/#get-a-token)
when they are not used in a specified time (default to be one year).
-->
当服务账号令牌在指定时间内（默认为一年）未被使用时，
允许基于 Secret 清理[服务账号令牌](/zh-cn/docs/concepts/security/service-accounts/#get-a-token)。
