---
title: RemoveSelfLink
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.16"
    toVersion: "1.19"
  - stage: beta
    defaultValue: true
    fromVersion: "1.20"  
    toVersion: "1.23" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"  
    toVersion: "1.29"

removed: true
---
فیلد `.metadata.selfLink` را برای همه اشیاء و مجموعه‌ها خالی (رشته خالی) تنظیم می‌کند. این فیلد از زمان انتشار Kubernetes v1.16 منسوخ شده است. هنگامی که این ویژگی فعال می‌شود، فیلد `.metadata.selfLink` بخشی از API Kubernetes باقی می‌ماند، اما همیشه تنظیم نشده است.
