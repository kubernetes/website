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
    toVersion: "1.33"
  - stage: stable
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Enables scheduler [queueing hints](/docs/concepts/scheduling-eviction/scheduling-framework/#queueinghint),
which benefits to reduce the useless requeuing.
The scheduler retries scheduling pods if something changes in the cluster that could make the pod scheduled.
Queueing hints are internal signals that allow the scheduler to filter the changes in the cluster
that are relevant to the unscheduled pod, based on previous scheduling attempts.
-->
啓用調度器的[排隊提示](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/#queueinghint)，
有助於減少無效的重新排隊。調度器會在集羣中發生可能導致 Pod 被重新調度的變化時，嘗試重新進行 Pod 的調度。
排隊提示是一些內部信號，用於幫助調度器基於先前的調度嘗試來篩選集羣中與未調度的 Pod 相關的變化。
