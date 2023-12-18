---
# Removed from Kubernetes
title: IngressClassNamespacedParams
content_type: feature_gate

_build:
  list: never
  render: false
---
Allow namespace-scoped parameters reference in
`IngressClass` resource. This feature adds two fields - `Scope` and `Namespace`
to `IngressClass.spec.parameters`.
