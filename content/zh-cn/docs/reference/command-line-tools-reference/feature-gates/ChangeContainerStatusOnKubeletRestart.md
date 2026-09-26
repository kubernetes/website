---
title: ChangeContainerStatusOnKubeletRestart
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.35"
---

<!--
Enable legacy writes to update container `ready` status after the kubelet detects a
[restart](/docs/concepts/workloads/pods/pod-lifecycle/#kubelet-restarts).

This feature gate was introduced to allow you revert the behavior to a previously used default.
If you are satisfied with the default behavior, you do not need to enable this
feature gate.
-->
启用旧版的写入机制，以在 kubelet
检测到[重启](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#kubelet-restarts)后更新容器的
`ready` 状态。

此特性门控的引入是为了允许你将行为恢复到以前使用的默认值。
如果你对默认行为感到满意，则无需启用此特性门控。
