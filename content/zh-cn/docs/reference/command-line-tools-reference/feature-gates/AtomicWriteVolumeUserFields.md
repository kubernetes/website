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

<!--
This feature gate exists in the Kubernetes API server and kubelet.
-->
此特性门控存在于 Kubernetes API 服务器和 kubelet 中。

<!--
Used from the kube-apiserver, it allows users to set the `user` and `defaultUser` fields
across `configMap`, `secret`, `downwardAPI` and `projected` volumes.
-->
在 `kube-apiserver` 中使用时，它允许用户在
`configMap`、`secret`、`downwardAPI` 和 `projected` 卷上设置
`user` 和 `defaultUser` 字段。

<!--
In kubelet, if the `user` or `defaultUser` fields are specified for a volume,
it sets the owner UID of the volume's data files during file creation.
-->
在 kubelet 中，如果为某个卷指定了 `user` 或 `defaultUser` 字段，
它会在创建文件时设置该卷数据文件的所有者 UID。
