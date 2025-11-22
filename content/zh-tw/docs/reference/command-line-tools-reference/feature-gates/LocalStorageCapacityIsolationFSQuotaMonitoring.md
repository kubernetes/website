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

<!--
When `LocalStorageCapacityIsolation` 
is enabled for 
[local ephemeral storage](/docs/concepts/configuration/manage-resources-containers/), 
the backing filesystem for [emptyDir volumes](/docs/concepts/storage/volumes/#emptydir) supports project quotas,
and `UserNamespacesSupport` is enabled, 
project quotas are used to monitor `emptyDir` volume storage consumption rather than using filesystem walk, ensuring better performance and accuracy.
-->
如果[本地臨時儲存](/zh-cn/docs/concepts/configuration/manage-resources-containers/)啓用了
`LocalStorageCapacityIsolation`，並且
[emptyDir 卷](/zh-cn/docs/concepts/storage/volumes/#emptydir)所使用的檔案系統支持項目配額，
並且已啓用 `UserNamespacesSupport`，
系統將使用項目配額來監控 `emptyDir` 卷的儲存使用情況，而不是通過檔案系統遍歷來實現，
從而確保更好的性能和準確性。
