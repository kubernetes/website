---
title: RelaxedServiceNameValidation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
---

<!--
Enables relaxed validation for Service object names, allowing the use of [RFC 1123 label names](/docs/concepts/overview/working-with-objects/names/#dns-label-names) instead of [RFC 1035 label names](/docs/concepts/overview/working-with-objects/names/#rfc-1035-label-names).

This feature allows Service object names to start with a digit.
-->
啓用對 Service 對象名稱的寬鬆校驗，允許使用
[RFC 1123 標籤名稱](/zh-cn/docs/concepts/overview/working-with-objects/names/#dns-label-names)來替代
[RFC 1035 標籤名稱](/zh-cn/docs/concepts/overview/working-with-objects/names/#rfc-1035-label-names)。

此特性允許 Service 名稱以數字開頭。
