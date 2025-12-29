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
Enables volume limit scaling for CSI drivers. This allows scheduler to
co-ordinate better with cluster-autoscaler for storage limits.
See [Storage Limits](/docs/concepts/storage/storage-limits/)
for more information.
