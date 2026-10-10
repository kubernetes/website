---
title: ClusterTrustBundle
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.32"
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.36"
  - stage: stable
    defaultValue: true
    fromVersion: "1.37"
---
This feature gate exists in the Kubernetes API server and the controller manager.

Used from the kube-apiserver, it enables ClusterTrustBundle support.

In the Kubernetes controller manager, it is used to control publishing of a ClusterTrustBundle
for the `kubernetes.io/kube-apiserver-serving` signer.