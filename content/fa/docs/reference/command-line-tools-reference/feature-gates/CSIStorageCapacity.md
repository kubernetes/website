---
title: CSIStorageCapacity
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.19"
    toVersion: "1.20"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.23"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.27"

removed: true  
---
درایورهای CSI را قادر می‌سازد تا اطلاعات ظرفیت ذخیره‌سازی را منتشر کنند
و زمان‌بند Kubernetes از آن اطلاعات هنگام زمان‌بندی پادها استفاده کند. برای جزئیات بیشتر به [Storage Capacity](/docs/concepts/storage/storage-capacity/). مراجعه کنید.
برای جزئیات بیشتر، مستندات [`csi` volume type](/docs/concepts/storage/volumes/#csi) را بررسی کنید.