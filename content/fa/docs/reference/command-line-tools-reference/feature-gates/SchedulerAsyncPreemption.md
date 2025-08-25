---
title: SchedulerAsyncPreemption
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---

اجرای برخی عملیات پرهزینه را در زمان‌بند، مرتبط با [preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/)، به صورت غیرهمزمان، فعال کنید.
پردازش غیرهمزمان preemption، تأخیر کلی زمان‌بندی Pod را بهبود می‌بخشد.
