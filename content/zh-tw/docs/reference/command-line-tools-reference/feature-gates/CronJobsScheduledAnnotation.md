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
<!--
Set the scheduled job time as an
{{< glossary_tooltip text="annotation" term_id="annotation" >}} on Jobs that were created
on behalf of a CronJob.
-->
將調度作業的時間設置爲代表 CronJob 創建的作業上的一個
  {{< glossary_tooltip text="註解" term_id="annotation" >}}。
