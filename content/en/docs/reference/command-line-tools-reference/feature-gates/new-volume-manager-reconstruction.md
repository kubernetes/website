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
---
Enables improved discovery of mounted volumes during kubelet
startup. Since this code has been significantly refactored, we allow to opt-out in case kubelet
gets stuck at the startup or is not unmounting volumes from terminated Pods. Note that this
refactoring was behind `SELinuxMountReadWriteOncePod` alpha feature gate in Kubernetes 1.25.

<!-- remove next 2 paragraphs when feature graduates to GA -->
Before Kubernetes v1.25, the kubelet used different default behavior for discovering mounted
volumes during the kubelet startup. If you disable this feature gate (it's enabled by default), you select
the legacy discovery behavior.

In Kubernetes v1.25 and v1.26, this behavior toggle was part of the `SELinuxMountReadWriteOncePod`
feature gate.
