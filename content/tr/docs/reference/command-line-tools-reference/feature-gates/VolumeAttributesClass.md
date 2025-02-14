---
title: VolumeAttributesClass
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.30"
  - stage: beta
    defaultValue: false
    fromVersion: "1.31"
---
Enable support for VolumeAttributesClasses.
See [Volume Attributes Classes](/docs/concepts/storage/volume-attributes-classes/)
for more information.
