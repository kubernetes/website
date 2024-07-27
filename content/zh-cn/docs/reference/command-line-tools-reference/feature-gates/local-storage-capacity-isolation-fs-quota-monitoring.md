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
---

<!--
When `LocalStorageCapacityIsolation`
is enabled for
[local ephemeral storage](/docs/concepts/configuration/manage-resources-containers/)
and the backing filesystem for [emptyDir volumes](/docs/concepts/storage/volumes/#emptydir)
supports project quotas and they are enabled, use project quotas to monitor
[emptyDir volume](/docs/concepts/storage/volumes/#emptydir) storage consumption rather than
filesystem walk for better performance and accuracy.
-->
如果[本地临时存储](/zh-cn/docs/concepts/configuration/manage-resources-containers/)启用了
`LocalStorageCapacityIsolation`，并且
[emptyDir 卷](/zh-cn/docs/concepts/storage/volumes/#emptydir)所使用的文件系统支持项目配额，
并且启用了这些配额，将使用项目配额来监视
[emptyDir 卷](/zh-cn/docs/concepts/storage/volumes/#emptydir)的存储消耗而不是遍历文件系统，
以此获得更好的性能和准确性。
