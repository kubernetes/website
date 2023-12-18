---
# Removed from Kubernetes
title: CSIServiceAccountToken
content_type: feature_gate

_build:
  list: never
  render: false
---
<!--
Enable CSI drivers to receive the pods' service account token
that they mount volumes for. See
[Token Requests](https://kubernetes-csi.github.io/docs/token-requests.html).
-->
允许 CSI 驱动接收挂载卷目标 Pods 的服务账号令牌。
参阅[令牌请求（Token Requests）](https://kubernetes-csi.github.io/docs/token-requests.html)。
