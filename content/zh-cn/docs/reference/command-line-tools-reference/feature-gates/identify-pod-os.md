---
# Removed from Kubernetes
title: IdentifyPodOS
content_type: feature_gate

_build:
  list: never
  render: false
---

<!--
Allows the Pod OS field to be specified. This helps in identifying
the OS of the pod authoritatively during the API server admission time.
In Kubernetes {{< skew currentVersion >}}, the allowed values for the `pod.spec.os.name`
are `windows` and `linux`.
-->
允许设置 Pod 的 `os` 字段。这有助于在 API 服务器准入时确定性地辨识 Pod 的 OS。
在 Kubernetes {{< skew currentVersion >}} 中，`pod.spec.os.name` 的允许值为
`windows` 和 `linux`。
