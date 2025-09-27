---
title: APIServerTracing
content_type: feature_gate
_build:
  list: never

  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"  
---
پشتیبانی از ردیابی توزیع‌شده در سرور API اضافه شود. برای جزئیات بیشتر به [Traces for Kubernetes System Components](/docs/concepts/cluster-administration/system-traces) مراجعه کنید.