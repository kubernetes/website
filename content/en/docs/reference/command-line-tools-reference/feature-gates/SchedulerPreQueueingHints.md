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
Enables scheduler [pre-queueing hints](/docs/concepts/scheduling-eviction/scheduling-framework/#prequeueinghint).
When a cluster event happens, a plugin's pre-queueing hint identifies which unschedulable Pods
the event could affect, so the scheduler runs that plugin's
[queueing hint](/docs/concepts/scheduling-eviction/scheduling-framework/#queueinghint)
only for those Pods instead of for every Pod the plugin rejected.
