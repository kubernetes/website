---
# Removed from Kubernetes
title: CSIVolumeFSGroupPolicy
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.19"
    toVersion: "1.19"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.22"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.25"

removed: true  
---
به CSIDrivers اجازه می‌دهد تا از فیلد `fsGroupPolicy` استفاده کنند.
این فیلد کنترل می‌کند که آیا Volume های ایجاد شده توسط CSIDriver از مالکیت Volume و تغییرات مجوز هنگام Mount شدن این Volume ها پشتیبانی می‌کنند یا خیر.