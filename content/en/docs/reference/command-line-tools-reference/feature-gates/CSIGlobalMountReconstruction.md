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
are still staged on the node after a kubelet restart or a node reboot, even when no
Pod directory describes them anymore: for example, when the node rebooted while
`NodeUnstageVolume` was in progress, or when the `vol_data.json` file in the Pod's
volume directory is missing or corrupt. Without this feature gate, the kubelet has
no record of such a volume and leaves it out of the Node's `.status.volumesInUse`,
so the attach/detach controller may attach it to another node before it is unstaged
on this one. With the feature gate enabled, the kubelet also looks for staged
volumes in the CSI global mount directories when it starts, and keeps each volume
it finds there in `.status.volumesInUse` until it has unstaged that volume.
