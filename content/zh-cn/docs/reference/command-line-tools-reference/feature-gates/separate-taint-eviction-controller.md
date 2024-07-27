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
<!--
Enables running `TaintEvictionController`,
that performs [Taint-based Evictions](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions),
in a controller separated from `NodeLifecycleController`. When this feature is
enabled, users can optionally disable Taint-based Eviction setting the
`--controllers=-taint-eviction-controller` flag on the `kube-controller-manager`.
-->
允许运行 `TaintEvictionController`，该控制器可在 `NodeLifecycleController`
之外执行[基于污点的驱逐](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions)。
此特性启用时，用户可以在 `kube-controller-manager`
上设置 `--controllers=-taint-eviction-controller` 标志，
可选择禁用基于污点的驱逐。