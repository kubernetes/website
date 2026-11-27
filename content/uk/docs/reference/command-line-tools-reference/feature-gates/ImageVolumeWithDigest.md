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
Для кожного [тому `image`](/docs/concepts/storage/volumes#image) в Podʼі записувати digest образу як частину статусу Podʼа.
