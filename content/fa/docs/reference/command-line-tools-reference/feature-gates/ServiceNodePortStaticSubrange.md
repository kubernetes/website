---
title: ServiceNodePortStaticSubrange
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.27"
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"  
    toVersion: "1.28" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.29" 
    toVersion: "1.30" 

removed: true  
---
استفاده از استراتژی‌های مختلف تخصیص پورت را برای سرویس‌های NodePort فعال می‌کند. برای جزئیات بیشتر، به [reserve NodePort ranges to avoid collisions](/docs/concepts/services-networking/service/#avoid-nodeport-collisions). مراجعه کنید.