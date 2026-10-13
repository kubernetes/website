---
title: SchedulerPreQueueingHints
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
    toVersion: "1.37"
  - stage: beta
    defaultValue: true
    fromVersion: "1.38"
---
Enables [PreQueueingHint](/docs/concepts/scheduling-eviction/scheduling-framework/#prequeueinghint)
in the scheduler, which lets a plugin limit its
[QueueingHint](/docs/concepts/scheduling-eviction/scheduling-framework/#queueinghint)
checks for a cluster event to the unschedulable Pods that the event could affect.
