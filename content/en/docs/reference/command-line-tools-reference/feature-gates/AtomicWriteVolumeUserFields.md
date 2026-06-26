---
title: AtomicWriteVolumeUserFields
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
This feature gate exists in the Kubernetes API server and kubelet.

Used from the kube-apiserver, it allows users to set the `user` and `defaultUser` fields
across `configMap`, `secret`, `downwardAPI` and `projected` volumes.

In kubelet, if the `user` or `defaultUser` fields are specified for a volume,
it sets the owner UID of the volume's data files during file creation.
