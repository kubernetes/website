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

<!--
This feature gate exists in the Kubernetes API server and the controller manager.
-->
此特性门控存在于 Kubernetes API 服务器和控制器管理器中。

<!--
Used from the kube-apiserver, it enables ClusterTrustBundle support.

In order to use the ClusterTrustBundle API in your cluster, you need to enable this feature gate
and also [enable](/docs/tasks/administer-cluster/enable-disable-api/) the associated alpha API group
using the `--runtime-config` command line argument to kube-apiserver.
-->
此特性由 kube-apiserver 使用，用于启用 ClusterTrustBundle 支持。

要在集群中使用 ClusterTrustBundle API，您需要启用此特性门控，
并且还需要使用 kube-apiserver 的 `--runtime-config`
命令行参数启用关联的 Alpha API 组。

<!--
In the Kubernetes controller manager, it is used to control publishing of a ClusterTrustBundle
for the `kubernetes.io/kube-apiserver-serving` signer.
-->
在 Kubernetes 控制器管理器中，它用于控制为
`kubernetes.io/kube-apiserver-serving` 签名者发布
ClusterTrustBundle。
