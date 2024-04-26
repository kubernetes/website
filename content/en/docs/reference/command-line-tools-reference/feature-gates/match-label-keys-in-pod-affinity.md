---
title: MatchLabelKeysInPodAffinity
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.29"
---
Enable the `matchLabelKeys` and `mismatchLabelKeys` field for
[pod (anti)affinity](/docs/concepts/scheduling-eviction/assign-pod-node/).
