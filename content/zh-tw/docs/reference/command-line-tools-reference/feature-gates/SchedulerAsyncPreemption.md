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
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---

<!--
Enable running some expensive operations within the scheduler, associated with
[preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/), asynchronously.
Asynchronous processing of preemption improves overall Pod scheduling latency.
-->
允許以異步方式在調度器內運行一些與[搶佔](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)關聯的高開銷操作。
異步處理搶佔可以降低整體 Pod 調度的延遲。
