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
---

<!--
Enable _Pod level resources_:  the ability to specify resource requests and limits
at the Pod level, rather than only for specific containers.
-->
启用 **Pod 级别资源**：能够在 Pod 级别指定资源请求和限制，而不仅仅是针对特定的容器。
