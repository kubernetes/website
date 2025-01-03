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
Enables [the scheduler's _queueing hints_ feature](/docs/concepts/scheduling-eviction/scheduling-framework/#queueinghint),
which benefits to reduce the useless requeueing.
The scheduler retries scheduling pods if something changes in the cluster that could make the pod scheduled.
Queueing hints are internal signals that allow the scheduler to filter the changes in the cluster
that are relevant to the unscheduled pod, based on previous scheduling attempts.
