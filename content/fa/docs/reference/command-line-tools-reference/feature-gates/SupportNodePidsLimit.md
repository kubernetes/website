---
# Removed from Kubernetes
title: SupportNodePidsLimit
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.14"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.15"
    toVersion: "1.19"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.23"    

removed: true
---
پشتیبانی از محدود کردن PIDها را در Node فعال کنید. پارامتر `pid=<number>` در گزینه‌های `--system-reserved` و `--kube-reserved` را می‌توان مشخص کرد تا اطمینان حاصل شود که تعداد مشخص‌شده از شناسه‌های فرآیند به ترتیب برای کل سیستم و برای سرویس‌های سیستم Kubernetes رزرو می‌شوند.