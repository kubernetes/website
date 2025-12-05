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
通過在 activeQ 爲空時從 backoffQ 中彈出 Pod，以改善調度隊列的行爲。
這可以儘快處理潛在可調度的 Pod，消除回退隊列的懲罰效應。
