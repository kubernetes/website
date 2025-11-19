---
title: ClusterTrustBundleProjection
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.32"
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
---

<!--
[`clusterTrustBundle` projected volume sources](/docs/concepts/storage/projected-volumes#clustertrustbundle).
-->
[`clusterTrustBundle` 投射卷源](/zh-cn/docs/concepts/storage/projected-volumes#clustertrustbundle)。
