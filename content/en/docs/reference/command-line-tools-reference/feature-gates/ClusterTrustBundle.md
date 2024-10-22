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
Enable ClusterTrustBundle support, including kubelet integration. Also makes the Kubernetes
controller manager publish a ClusterTrustBundle for the `kubernetes.io/kube-apiserver-serving`
signer.
In order to use the ClusterTrustBundle API in your cluster, you need to enable this feature gate
and also [enable](/docs/tasks/administer-cluster/enable-disable-api/) the associated alpha API group
using the `--runtime-config` command line argument to kube-apiserver.