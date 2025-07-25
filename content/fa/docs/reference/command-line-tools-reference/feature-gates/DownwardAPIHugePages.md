---
title: DownwardAPIHugePages
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
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"    
  - stage: beta 
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.26"      
  - stage: stable
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.28"    

removed: true  
---
استفاده از صفحات بزرگ را در [API رو به پایین](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information) فعال می‌کند.
