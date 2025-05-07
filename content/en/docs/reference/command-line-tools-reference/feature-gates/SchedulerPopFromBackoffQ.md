---
title: SchedulerPopFromBackoffQ
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---

Improves scheduling queue behavior by popping pods from the backoffQ when the activeQ is empty.
This allows the scheduler to process potentially schedulable Pods as soon as possible,
eliminating a penalty effect of the backoff queue.

