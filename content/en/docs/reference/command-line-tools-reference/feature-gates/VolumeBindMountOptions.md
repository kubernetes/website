---
title: VolumeBindMountOptions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Enables setting bind mount options (`noexec`, `nodev`, `nosuid`) per container
volume mount using the `bindMountOptions` field in `volumeMounts`. When enabled,
the kubelet passes these options to the container runtime, which applies them as
Linux bind mount flags. The container runtime must support the `mount_options`
field in the CRI `Mount` message. This field has no effect on Windows nodes.
