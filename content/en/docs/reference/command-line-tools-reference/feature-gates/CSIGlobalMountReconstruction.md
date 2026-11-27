---
title: CSIGlobalMountReconstruction
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Enables the kubelet to find [CSI](/docs/concepts/storage/volumes/#csi) volumes that
are still staged on a node after a kubelet restart or a node reboot, so that Kubernetes
does not detach them before the kubelet unstages them. A staged volume is one that a
CSI driver has set up on the node (`NodeStageVolume`) and has not yet released
(`NodeUnstageVolume`). Without this feature gate, the kubelet can lose track of such a
volume. Kubernetes can then detach the volume (`ControllerUnpublishVolume` in CSI
terms) without unstaging it first, which can corrupt the data on the volume or leave
the storage backend in an inconsistent state. This feature gate only affects CSI
drivers that advertise the `STAGE_UNSTAGE_VOLUME` node capability.
