---
title: RemainingItemCount
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.15"
    toVersion: "1.15"
  - stage: beta
    defaultValue: true
    fromVersion: "1.16"
    toVersion: "1.28"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"   
    toVersion: "1.32"

removed: true
---
به سرورهای API اجازه دهید تعداد موارد باقی مانده را در پاسخ به یک [chunking list request](/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks). نشان دهند.