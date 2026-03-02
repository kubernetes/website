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
For each [`image` volume](/docs/concepts/storage/volumes#image) in a Pod,
image digest as part of the pod's status.