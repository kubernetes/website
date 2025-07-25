---
title: KubeletTracing
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
---
پشتیبانی از ردیابی توزیع‌شده در kubelet اضافه شود.
هنگامی که فعال شود، رابط CRI kubelet و سرورهای http احراز هویت‌شده برای تولید محدوده‌های ردیابی OpenTelemetry تجهیز می‌شوند.
برای جزئیات بیشتر به [Traces for Kubernetes System Components](/docs/concepts/cluster-administration/system-traces) مراجعه کنید.