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
    toVersion: "1.33"
  - stage: stable
    defaultValue: true
    fromVersion: "1.34"
---
Enables running `TaintEvictionController`,
that performs [Taint-based Evictions](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions),
in a controller separated from `NodeLifecycleController`. Users can optionally disable Taint-based Eviction setting the
`--controllers=-taint-eviction-controller` flag on the `kube-controller-manager`.
