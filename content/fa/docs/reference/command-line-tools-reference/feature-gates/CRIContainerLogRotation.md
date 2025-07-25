---
# Removed from Kubernetes
title: CRIContainerLogRotation
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.10"
    toVersion: "1.10"
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
چرخش گزارش کانتینر را برای زمان اجرای کانتینر CRI فعال کنید.
حداکثر اندازه پیش‌فرض یک فایل گزارش ۱۰ مگابایت و حداکثر تعداد پیش‌فرض فایل‌های گزارش مجاز برای یک کانتینر ۵ است.
این مقادیر را می‌توان در پیکربندی kubelet پیکربندی کرد.
برای جزئیات بیشتر به [logging at node level](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level) مراجعه کنید.