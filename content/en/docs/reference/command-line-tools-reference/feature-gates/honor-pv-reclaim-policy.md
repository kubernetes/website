---
title: HonorPVReclaimPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
---
Honor persistent volume reclaim policy when it is `Delete` irrespective of PV-PVC deletion ordering.
For more details, check the
[PersistentVolume deletion protection finalizer](/docs/concepts/storage/persistent-volumes/#persistentvolume-deletion-protection-finalizer)
documentation.
