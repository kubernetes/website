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
---

<!--
Relax the server side validation for the DNS search string
(`.spec.dnsConfig.searches`) for containers. For example,
with this gate enabled, it is okay to include the `_` character
in the DNS name search string.
-->
放宽对容器的 DNS 搜索字符串（`.spec.dnsConfig.searches`）的服务器端校验。
例如，在启用此门控的情况下，允许在 DNS 名称搜索字符串中包含 `_` 字符。
