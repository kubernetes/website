---
# Removed from Kubernetes
title: ValidateProxyRedirects
content_type: feature_gate

_build:
  list: never
  render: false
---
This flag controls whether the API server should validate that redirects
are only followed to the same host. Only used if the `StreamingProxyRedirects` flag is enabled.
