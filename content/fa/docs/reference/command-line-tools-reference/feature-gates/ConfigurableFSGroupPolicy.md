---
# از Kubernetes حذف شد
title: ConfigurableFSGroupPolicy
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.18"
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
به کاربر اجازه می‌دهد تا سیاست تغییر مجوز حجم را برای fsGroups هنگام نصب یک حجم در یک Pod پیکربندی کند. برای جزئیات بیشتر به [Configure volume permission and ownership change policy for Pods](/docs/tasks/configure-pod-container/security-context/#configure-volume-permission-and-ownership-change-policy-for-pods) مراجعه کنید.
