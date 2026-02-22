---
title: KubeletSeparateDiskGC
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
    defaultValue: true
    fromVersion: "1.31"
---
The split image filesystem feature enables kubelet to perform garbage collection
of images (read-only layers) and/or containers (writeable layers) deployed on
separate filesystems.
