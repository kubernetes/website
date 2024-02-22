---
title: NewVolumeManagerReconstruction
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.27"
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
    toVersion: "1.29"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
---
Enables improved discovery of mounted volumes during kubelet
startup. Since this code has been significantly refactored, Kubernetes versions 1.25 - 1.29
allowed to opt-out in case kubelet gets stuck at the startup or is not unmounting volumes
from terminated Pods. Note that this refactoring was behind `SELinuxMountReadWriteOncePod`
alpha feature gate in versions 1.25 - 1.26.
