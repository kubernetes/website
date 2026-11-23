---
title: ImageVolumeWithDigest
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Для кожного [тому `image`](/docs/reference/storage/volume-types/#image) в Podʼі записувати digest образу як частину статусу Podʼа.
