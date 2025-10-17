---
title: CSIServiceAccountTokenSecrets
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---
Enables CSI drivers to opt-in for receiving service account tokens from kubelet
through the dedicated secrets field in NodePublishVolumeRequest instead of the volume_context field.
