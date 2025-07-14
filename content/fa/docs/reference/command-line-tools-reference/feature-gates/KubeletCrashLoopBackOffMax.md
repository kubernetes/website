---
title: KubeletCrashLoopBackOffMax
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---
پشتیبانی از حداکثرهای قابل تنظیم برای هر گره برای راه‌اندازی مجدد کانتینرها در حالت `CrashLoopBackOff` را فعال می‌کند. برای جزئیات بیشتر، فیلد `crashLoopBackOff.maxContainerRestartPeriod` را در [kubelet config file](/docs/reference/config-api/kubelet-config.v1beta1/). بررسی کنید.