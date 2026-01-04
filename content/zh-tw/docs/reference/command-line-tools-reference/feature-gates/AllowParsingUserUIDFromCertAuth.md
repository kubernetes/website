---
title: AllowParsingUserUIDFromCertAuth
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

<!--
When this feature is enabled, the subject name attribute `1.3.6.1.4.1.57683.2`
in an X.509 certificate will be parsed as the user UID during certificate authentication.
-->
當啓用此特性時，X.509 證書中的主體名稱屬性 `1.3.6.1.4.1.57683.2` 將在證書認證過程中被解析爲使用者 UID。
