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

<!--
This feature gate exists in the Kubernetes API server and the controller manager.
-->
此特性门控存在于 Kubernetes API 服务器和控制器管理器中。

<!--
Used from the kube-apiserver, it enables ClusterTrustBundle support.
-->
此特性由 kube-apiserver 使用，用于启用 ClusterTrustBundle 支持。

<!--
In the Kubernetes controller manager, it is used to control publishing of a ClusterTrustBundle
for the `kubernetes.io/kube-apiserver-serving` signer.
-->
在 Kubernetes 控制器管理器中，它用于控制为
`kubernetes.io/kube-apiserver-serving` 签名者发布
ClusterTrustBundle。
