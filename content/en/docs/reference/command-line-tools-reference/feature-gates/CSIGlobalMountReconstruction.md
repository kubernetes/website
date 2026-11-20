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
are still staged after a kubelet restart or a node reboot, but that no Pod directory
describes anymore. Without this feature gate, such a volume is missing from the Node's
`.status.volumesInUse`, and the attach/detach controller may attach it to another node
before it is unstaged. With the feature gate enabled, the kubelet keeps each such
volume in `.status.volumesInUse` until it has unstaged it. After a kubelet restart, it
also reads the copy of `vol_data.json` beside the global mount when the Pod's copy is
missing or corrupt. Only CSI drivers that implement `NodeStageVolume` are affected.
