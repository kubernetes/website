---
title: EfficientWatchResumption
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
    defaultValue: true
    fromVersion: "1.21"  
    toVersion: "1.23" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"  
    toVersion: "1.32"

removed: true
---
اجازه می‌دهد رویدادهای نشانه‌گذاری (اعلان پیشرفت) که از حافظه ایجاد شده‌اند، به کاربران تحویل داده شوند. این فقط برای عملیات‌های نظارتی اعمال می‌شود.
