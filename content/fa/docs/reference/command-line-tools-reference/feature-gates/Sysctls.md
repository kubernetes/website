---
title: Sysctls
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.11"
    toVersion: "1.20"
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"    

removed: true
---
پشتیبانی از پارامترهای هسته با فضای نام (sysctls) را که می‌توانند برای هر پاد تنظیم شوند، فعال کنید. برای جزئیات بیشتر به [sysctls](/docs/tasks/administer-cluster/sysctl-cluster/) مراجعه کنید.