---
title: JobTrackingWithFinalizers
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.22"
  - stage: beta
    defaultValue: false
    fromVersion: "1.23"  
    toVersion: "1.24" 
  - stage: beta
    defaultValue: true
    fromVersion: "1.25"  
    toVersion: "1.25" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.28"     

removed: true
---
ردیابی تکمیل‌های [Job](/docs/concepts/workloads/controllers/job) را بدون تکیه بر Podهای باقی‌مانده در کلاستر به طور نامحدود، فعال می‌کند.
کنترل‌کننده‌ی Job از نهایی‌کننده‌های Pod و یک فیلد در وضعیت Job برای پیگیری Podهای تکمیل‌شده استفاده می‌کند تا در جهت تکمیل شمارش شوند.