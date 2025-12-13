---
title: PodLevelResources
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Enable _Pod level resources_:  the ability to specify resource requests and limits
at the Pod level, rather than only for specific containers.
-->
啓用 **Pod 級別資源**：能夠在 Pod 級別指定資源請求和限制，而不僅僅是針對特定的容器。
