---
title: ClusterTrustBundle
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.32"
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
---

<!--
Enable ClusterTrustBundle objects and kubelet integration.
-->
啓用 ClusterTrustBundle 對象和 kubelet 集成。
