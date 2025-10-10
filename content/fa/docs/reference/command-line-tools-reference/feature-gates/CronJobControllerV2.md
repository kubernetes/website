---
# از Kubernetes حذف شد
title: CronJobControllerV2
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.20"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.21"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.23"

removed: true  
---
از یک پیاده‌سازی جایگزین از کنترلر {{< glossary_tooltip text="CronJob" term_id="cronjob" >}} استفاده کنید. در غیر این صورت، نسخه ۱ از همان کنترلر انتخاب می‌شود.
