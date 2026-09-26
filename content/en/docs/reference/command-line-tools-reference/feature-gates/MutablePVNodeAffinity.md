---
title: MutablePVNodeAffinity
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Allow update to the `.spec.nodeAffinity` field of a PersistentVolume.
See [Updates to node affinity](/docs/concepts/storage/persistent-volumes/#updates-to-node-affinity) for more details.
