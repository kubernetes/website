---
# Removed from Kubernetes
title: WindowsEndpointSliceProxying
content_type: feature_gate

_build:
  list: never
  render: false
---
When enabled, kube-proxy running on Windows will use
EndpointSlices as the primary data source instead of Endpoints, enabling scalability and
performance improvements. See
[Enabling Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/).
