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
See [Update to Node Affinity](/docs/concepts/storage/persistent-volumes/#update-to-node-affinity) for more details.
