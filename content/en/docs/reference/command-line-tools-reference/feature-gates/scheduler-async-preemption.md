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

Running some expensive operation within [the scheduler's preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/) asynchronously,
which improves the scheduling latency when the preemption involves in.
