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
将调度作业的时间设置为代表 CronJob 创建的作业上的一个
  {{< glossary_tooltip text="注解" term_id="annotation" >}}。
