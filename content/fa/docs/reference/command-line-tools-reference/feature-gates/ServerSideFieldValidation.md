---
title: ServerSideFieldValidation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.24"
  - stage: beta
    defaultValue: true
    fromVersion: "1.25"  
    toVersion: "1.26" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.27"  
    toVersion: "1.31"

removed: true
---
اعتبارسنجی فیلد سمت سرور را فعال می‌کند. این به این معنی است که اعتبارسنجی طرحواره منابع در سمت سرور API به جای سمت کلاینت انجام می‌شود (برای مثال، خط فرمان `kubectl create` یا `kubectl apply`).