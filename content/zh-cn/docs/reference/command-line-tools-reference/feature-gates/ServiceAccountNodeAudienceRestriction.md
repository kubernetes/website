---
title: ServiceAcccountNodeAudienceRestriction
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"  

---

<!--
This gate is used to restrict the audience for which the kubelet can request a service account token for.
-->
此特性门控用于限制 kubelet 可以请求服务账号令牌的受众范围。
