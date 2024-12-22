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
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"

---
Set the scheduled job time as an
{{< glossary_tooltip text="annotation" term_id="annotation" >}} on Jobs that were created
on behalf of a CronJob.
