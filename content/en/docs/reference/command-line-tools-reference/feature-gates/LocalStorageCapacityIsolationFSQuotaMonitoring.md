---
title: LocalStorageCapacityIsolationFSQuotaMonitoring
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.15"
    toVersion: "1.30"
  - stage: beta 
    defaultValue: false
    fromVersion: "1.31"
---
When the backing filesystem for an [emptyDir](/docs/concepts/storage/volumes/#emptydir)
volume supports project quotas, and the `UserNamespacesSupport` feature is enabled, 
project quotas are used to monitor `emptyDir` volume storage consumption rather than
using filesystem walking, ensuring better performance and accuracy.
