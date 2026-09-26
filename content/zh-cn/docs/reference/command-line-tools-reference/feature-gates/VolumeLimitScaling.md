---
title: VolumeLimitScaling
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---

<!--
Enables volume limit scaling for CSI drivers. This allows scheduler to
co-ordinate better with cluster-autoscaler for storage limits.
See [Storage Limits](/docs/concepts/storage/storage-limits/)
for more information.
-->
启用 CSI 驱动程序的卷限制扩展。这使得调度器能够更好地与
cluster-autoscaler 协调存储限制。
详见[存储限制](/zh-cn/docs/concepts/storage/storage-limits/)。
