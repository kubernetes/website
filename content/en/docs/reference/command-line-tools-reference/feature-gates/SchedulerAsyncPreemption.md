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

Enable running some expensive operations within the scheduler, associated with
[preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/), asynchronously.
Asynchronous processing of preemption improves overall Pod scheduling latency.
