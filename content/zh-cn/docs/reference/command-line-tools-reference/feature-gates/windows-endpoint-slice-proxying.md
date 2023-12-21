---
# Removed from Kubernetes
title: WindowsEndpointSliceProxying
content_type: feature_gate

_build:
  list: never
  render: false
---

<!--
When enabled, kube-proxy running on Windows will use
EndpointSlices as the primary data source instead of Endpoints, enabling scalability and
performance improvements. See
[Enabling Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/).
-->
启用后，运行在 Windows 上的 kube-proxy
将使用 EndpointSlice 而不是 Endpoints 作为主要数据源，从而实现可伸缩性和性能改进。
详情请参见[启用端点切片](/zh-cn/docs/concepts/services-networking/endpoint-slices/)。
