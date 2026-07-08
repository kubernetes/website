---
title: PersistentVolumeClaimUnusedSinceTime
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---
When enabled, the PVC protection controller adds an `Unused` condition to
PersistentVolumeClaims that tracks whether the PVC is currently referenced by
any non-terminal Pod. The condition's `lastTransitionTime` records when the PVC
last transitioned between being in use and being unused.
