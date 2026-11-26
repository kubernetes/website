---
title: InPlacePodVerticalScalingExclusiveCPUs
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---

<!--
Enables in-place CPU resizing for containers in Guaranteed Pods that use
exclusive CPUs allocated by the static CPU manager policy.
Requires the static CPU manager policy on the node.
The feature is implemented starting with v1.38. Versions v1.32 to v1.37 have
this feature gate, but do not implement the feature.
-->
为 Guaranteed Pod 中使用由 `static` CPU 管理器策略分配的独占 CPU 的容器启用原地 CPU 调整。
此特性要求节点配置 `static` CPU 管理器策略。
该功能在 v1.38 及更高版本中实现。v1.32 至 v1.37 版本包含此特性门控，但并未实现该功能。
