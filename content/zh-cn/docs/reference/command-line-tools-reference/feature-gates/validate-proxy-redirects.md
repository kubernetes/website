---
# Removed from Kubernetes
title: ValidateProxyRedirects
content_type: feature_gate

_build:
  list: never
  render: false
---

<!--
This flag controls whether the API server should validate that redirects
are only followed to the same host. Only used if the `StreamingProxyRedirects` flag is enabled.
-->
这个标志控制 API 服务器是否检查重定向仅指向相同主机。
仅在启用 `StreamingProxyRedirects` 标志时被使用。
