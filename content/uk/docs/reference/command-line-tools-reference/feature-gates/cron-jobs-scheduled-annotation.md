---
title: CronJobsScheduledAnnotation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
---
Встановіть час запланованого завдання як {{< glossary_tooltip text="анотацію" term_id="annotation" >}} для завдань, створених від імені CronJob.
