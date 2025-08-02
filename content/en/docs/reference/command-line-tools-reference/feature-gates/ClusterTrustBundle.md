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
---
This feature gate exists in the Kubernetes API server and the controller manager.

Used from the kube-apiserver, it enables ClusterTrustBundle support.

In order to use the ClusterTrustBundle API in your cluster, you need to enable this feature gate
and also [enable](/docs/tasks/administer-cluster/enable-disable-api/) the associated alpha API group
using the `--runtime-config` command line argument to kube-apiserver.

In the Kubernetes controller manager, it is used to control publishing of a ClusterTrustBundle
for the `kubernetes.io/kube-apiserver-serving` signer.