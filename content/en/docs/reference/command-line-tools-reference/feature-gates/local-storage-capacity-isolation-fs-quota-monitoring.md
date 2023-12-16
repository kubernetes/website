---
title: LocalStorageCapacityIsolationFSQuotaMonitoring
content_type: feature_gate
_build:
  list: never
  render: false
---
When `LocalStorageCapacityIsolation`
is enabled for
[local ephemeral storage](/docs/concepts/configuration/manage-resources-containers/)
and the backing filesystem for [emptyDir volumes](/docs/concepts/storage/volumes/#emptydir)
supports project quotas and they are enabled, use project quotas to monitor
[emptyDir volume](/docs/concepts/storage/volumes/#emptydir) storage consumption rather than
filesystem walk for better performance and accuracy.
