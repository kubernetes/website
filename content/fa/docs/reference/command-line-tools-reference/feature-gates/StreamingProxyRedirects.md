---
# Removed from Kubernetes
title: StreamingProxyRedirects
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: false
    fromVersion: "1.5"
    toVersion: "1.5"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.6"
    toVersion: "1.17"    
  - stage: deprecated 
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.21"
  - stage: deprecated 
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.24"

removed: true
---
به سرور API دستور می‌دهد تا ریدایرکت‌ها را از backend (kubelet) برای درخواست‌های استریمینگ رهگیری (و دنبال) کند. نمونه‌هایی از درخواست‌های استریمینگ شامل درخواست‌های `exec`، `attach` و `port-forward` می‌شود.