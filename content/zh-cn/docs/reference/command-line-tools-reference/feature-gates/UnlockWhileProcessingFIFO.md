---
title: UnlockWhileProcessingFIFO
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---

<!--
Enable use of a FIFO queue within client-go that unlocks while processing events. If not enabled, 
the queue instead holds the lock for the entire duration of processing events, which could lead 
to performance issues in high-throughput scenarios.
This feature gate can be toggled in the kube-controller-manager and
any client-go based controller.
-->
启用在 client-go 中使用在处理事件时解锁的 FIFO 队列。
如果未启用，队列会在处理事件的整个过程中持有锁，这可能会在高吞吐量场景中出现性能问题。
此特性门控可以在 kube-controller-manager 和任何基于 client-go 的控制器中切换。

<!--
You can only enable this feature gate if the
[AtomicFIFO](/docs/reference/command-line-tools-reference/feature-gates/#AtomicFIFO)
feature gate is also enabled.
-->
只有在同时启用了
[AtomicFIFO](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#AtomicFIFO)
特性门控的情况下，才能启用此特性门控。

