---
title: AllowServiceLBStatusOnNonLB
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: Depricated
    defaultValue: false
    fromVersion: "1.29"    
---

فعال کردن تنظیم `.status.ingress.loadBalancer` روی سرویس‌هایی از نوع غیر از `LoadBalancer`.