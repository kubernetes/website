---
title: StatefulSetAutoDeletePVC
content_type: feature_gate

_build:
  list: never
  render: false
---
Allows the use of the optional `.spec.persistentVolumeClaimRetentionPolicy` field, 
providing control over the deletion of PVCs in a StatefulSet's lifecycle.
See
[PersistentVolumeClaim retention](/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-retention)
for more details.