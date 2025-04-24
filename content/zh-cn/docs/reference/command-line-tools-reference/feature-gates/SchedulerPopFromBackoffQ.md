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

<!--
Improves scheduling queue behavior by popping pods from the backoffQ when the activeQ is empty.
This allows to process potentially schedulable pods ASAP, eliminating a penalty effect of the backoff queue.
-->
通过在 activeQ 为空时从 backoffQ 中弹出 Pod，以改善调度队列的行为。
这可以尽快处理潜在可调度的 Pod，消除回退队列的惩罚效应。
