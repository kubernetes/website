---
title: ImageVolumeWithDigest
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Report [ImageVolume](/docs/concepts/storage/volumes#image)'s
image digest as part of the pod's status.