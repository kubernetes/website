---
title: SchedulerQueueingHints
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.31"
  - stage: beta
    defaultValue: true
    fromVersion: "1.32"
---

<!--
Enables [the scheduler's _queueing hints_ feature](/docs/concepts/scheduling-eviction/scheduling-framework/#queueinghint),
which benefits to reduce the useless requeueing.
The scheduler retries scheduling pods if something changes in the cluster that could make the pod scheduled.
Queueing hints are internal signals that allow the scheduler to filter the changes in the cluster
that are relevant to the unscheduled pod, based on previous scheduling attempts.
-->
启用[调度器的**排队提示**特性](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/#queueinghint)，
有助于减少无效的重新排队。
调度器会在集群中发生可能导致 Pod 被重新调度的变化时，尝试重新进行 Pod 的调度。
排队提示是一些内部信号，
用于帮助调度器基于先前的调度尝试来筛选集群中与未调度的 Pod 相关的变化。
