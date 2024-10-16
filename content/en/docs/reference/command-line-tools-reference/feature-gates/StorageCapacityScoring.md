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
Enable node scoring based on available storage capacity.
Originally extended `VolumeCapacityPriority` (for static
provisioning) to dynamic provisioning. Now handles both
functions since `VolumeCapacityPriority` was removed.
Extends kube-scheduler's VolumeBinding plugin and uses
Storage Capacity Tracking supported CSI plugins.
Available for CSI-managed persistent volumes, including
local storage when supported by the CSI driver.
