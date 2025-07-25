---
# Removed from Kubernetes
title: ServiceNodeExclusion
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.8"
    toVersion: "1.18"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.20"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"    

removed: true
---
فعال کردن امکان حذف گره‌ها از متعادل‌کننده‌های بار ایجاد شده توسط یک ارائه‌دهنده ابری. یک گره در صورتی واجد شرایط حذف است که با برچسب "`node.kubernetes.io/exclude-from-external-load-balancers`" مشخص شده باشد.
