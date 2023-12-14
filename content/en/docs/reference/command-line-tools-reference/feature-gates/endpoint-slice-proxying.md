---
# Removed from Kubernetes
title: EndpointSliceProxying
content_type: feature_gate

_build:
  list: never
  render: false
---
When enabled, kube-proxy running
 on Linux will use EndpointSlices as the primary data source instead of
 Endpoints, enabling scalability and performance improvements. See
 [Enabling Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/).
