---
title: CronJobTimeZone
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.24"
    toVersion: "1.24"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.26"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.28"

removed: true  
---
<!--
Allow the use of the `timeZone` optional field in [CronJobs](/docs/concepts/workloads/controllers/cron-jobs/)
-->
允许在 [CronJobs](/zh-cn/docs/concepts/workloads/controllers/cron-jobs/)
中使用 `timeZone` 可选字段。
