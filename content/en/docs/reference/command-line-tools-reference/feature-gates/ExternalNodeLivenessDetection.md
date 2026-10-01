---
title: ExternalNodeLivenessDetection
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Allows node liveness detection to be handled by a component outside the
node lifecycle controller. When enabled, the `kube-controller-manager` accepts
`--node-liveness-source=external`, and the kubelet accepts
`enableNodeLease: false` in its configuration file.
Enabling this feature gate does not change any behavior by itself.
