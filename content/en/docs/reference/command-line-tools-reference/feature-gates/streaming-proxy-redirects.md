---
# Removed from Kubernetes
title: StreamingProxyRedirects
content_type: feature_gate

_build:
  list: never
  render: false
---
Instructs the API server to intercept (and follow) redirects from the
backend (kubelet) for streaming requests. Examples of streaming requests include the `exec`,
`attach` and `port-forward` requests.
