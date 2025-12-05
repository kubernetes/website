---
# Removed from Kubernetes
title: RequestManagement
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.15"
    toVersion: "1.16"
  - stage: deprecated
    fromVersion: "1.17"
    toVersion: "1.17"

removed: true
---
مدیریت همزمانی درخواست‌ها را با اولویت‌بندی و انصاف در هر سرور API فعال می‌کند. از نسخه ۱.۱۷ توسط `APIPriorityAndFairness` منسوخ شده است.