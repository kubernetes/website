---
title: RelaxedDNSSearchValidation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
    toVersion: "1.33"
  - stage: stable
    locked: true
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Relax the server side validation for the DNS search string
(`.spec.dnsConfig.searches`) for containers. For example,
with this gate enabled, it is okay to include the `_` character
in the DNS name search string.
-->
放寬對容器的 DNS 搜索字符串（`.spec.dnsConfig.searches`）的服務器端校驗。
例如，在啓用此門控的情況下，允許在 DNS 名稱搜索字符串中包含 `_` 字符。
