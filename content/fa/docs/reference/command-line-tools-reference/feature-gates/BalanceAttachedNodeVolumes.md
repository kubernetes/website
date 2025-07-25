---
# از Kubernetes حذف شد
title: BalanceAttachedNodeVolumes
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.11"
    toVersion: "1.21"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.22"

removed: true
---
تعداد حجم گره را برای تخصیص متوازن منابع در زمان‌بندی لحاظ کنید. گره‌ای که CPU، حافظه و تعداد حجم نزدیک‌تری دارد، در زمان تصمیم‌گیری توسط زمان‌بند ترجیح داده می‌شود.
