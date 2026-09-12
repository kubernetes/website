---
title: ClusterTrustBundleProjection
content_type: feature_gate
build:
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
    toVersion: "1.36"
  - stage: stable
    defaultValue: true
    fromVersion: "1.37"
---
[Джерела спроєцьованих томів `clusterTrustBundle`](/docs/concepts/storage/projected-volumes#clustertrustbundle).
