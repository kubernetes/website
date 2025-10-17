---
# Removed from Kubernetes
title: نام کاربری ویندوز (WindowsRunAsUserName)
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.16"
    toVersion: "1.16"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.17"
  - stage: stable
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.20"

removed: true
---
پشتیبانی از اجرای برنامه‌ها در کانتینرهای ویندوز را با یک کاربر غیر پیش‌فرض فعال کنید. برای جزئیات بیشتر به [Configuring RunAsUserName](/docs/tasks/configure-pod-container/configure-runasusername) مراجعه کنید.