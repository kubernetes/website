---
title: DryRun
content_type: feature_gate
_build:
  list: never
  render: false
 
stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.12"
    toVersion: "1.12"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.13"
    toVersion: "1.18"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.27"    

removed: true  
---
درخواست‌های سمت سرور [dry run](/docs/reference/using-api/api-concepts/#dry-run) را فعال کنید تا اعتبارسنجی، ادغام و جهش بدون کامیت کردن قابل آزمایش باشند.