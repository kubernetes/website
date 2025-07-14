---
title: SidecarContainers
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.33"
---
اجازه دهید `restartPolicy` یک کانتینر init را روی `Always` تنظیم کنیم تا کانتینر به یک کانتینر sidecar (کانتینرهای init قابل راه‌اندازی مجدد) تبدیل شود.
برای جزئیات بیشتر به [Sidecar containers and restartPolicy](/docs/concepts/workloads/pods/sidecar-containers/) مراجعه کنید.