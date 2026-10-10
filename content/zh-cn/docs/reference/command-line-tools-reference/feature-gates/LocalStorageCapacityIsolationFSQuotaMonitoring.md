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
如果[本地临时存储](/zh-cn/docs/concepts/configuration/manage-resources-containers/)启用了
`LocalStorageCapacityIsolation`，并且
[emptyDir 卷](/zh-cn/docs/concepts/storage/volumes/#emptydir)所使用的文件系统支持项目配额，
并且已启用 `UserNamespacesSupport`，
系统将使用项目配额来监控 `emptyDir` 卷的存储使用情况，而不是通过文件系统遍历来实现，
从而确保更好的性能和准确性。
