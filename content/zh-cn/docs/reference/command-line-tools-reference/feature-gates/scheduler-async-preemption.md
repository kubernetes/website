---
title: SchedulerAsyncPreemption
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
Enable running some expensive operations within the scheduler, associated with
[preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/), asynchronously.
Asynchronous processing of preemption improves overall Pod scheduling latency.
-->
允许以异步方式在调度器内运行一些与[抢占](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)关联的高开销操作。
异步处理抢占可以降低整体 Pod 调度的延迟。
