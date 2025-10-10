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
زمان کار برنامه‌ریزی‌شده را به عنوان یک {{< glossary_tooltip text="annotation" term_id="annotation" >}} برای کارهایی که از طرف یک CronJob ایجاد شده‌اند، تنظیم کنید.
