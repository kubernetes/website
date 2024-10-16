---
title: StorageCapacityScoring
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---
This feature adds a scoring method for pod scheduling with
[the topology-aware volume provisioning](/blog/2018/10/11/topology-aware-volume-provisioning-in-kubernetes/).
This feature eases to schedule pods on nodes with either the most or least
available storage capacity. This feature originally extended the
`VolumeCapacityPriority` feature (for static provisioning) to dynamic
provisioning. Now, this feature handles both types of provisioning since the
`VolumeCapacityPriority` feature gate was removed. This feature extends the
kube-scheduler's VolumeBinding plugin to perform scoring using node storage
capacity information obtained from [Storage Capacity](/docs/concepts/storage/storage-capacity/).
So, this feature is available for CSI-managed persistent volumes, including
local storage when it is supported by the CSI plugin.
