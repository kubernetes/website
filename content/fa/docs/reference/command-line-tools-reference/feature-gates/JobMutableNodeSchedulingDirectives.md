---
title: JobMutableNodeSchedulingDirectives
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.26"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.28"    

removed: true
---
امکان به‌روزرسانی دستورالعمل‌های زمان‌بندی گره را در قالب pod از [Job](/docs/concepts/workloads/controllers/job) فراهم می‌کند.
