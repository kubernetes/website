---
title: SeparateTaintEvictionController
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
---
Enables running `TaintEvictionController`,
that performs [Taint-based Evictions](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions),
in a controller separated from `NodeLifecycleController`. When this feature is
enabled, users can optionally disable Taint-based Eviction setting the
`--controllers=-taint-eviction-controller` flag on the `kube-controller-manager`.
