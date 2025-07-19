---
title: SchedulerQueueingHints
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.31"
  - stage: beta
    defaultValue: true
    fromVersion: "1.32"
---
[the scheduler's _queueing hints_ feature](/docs/concepts/scheduling-eviction/scheduling-framework/#queueinghint)را فعال می‌کند،
که به کاهش صف‌بندی‌های بی‌فایده کمک می‌کند.
زمانبند در صورت تغییر چیزی در خوشه که می‌تواند باعث برنامه‌ریزی غلاف شود، غلاف‌های زمان‌بندی را دوباره امتحان می‌کند.
Queuing hints سیگنال‌های داخلی هستند که به زمانبند اجازه می‌دهند تغییرات در خوشه که مربوط به غلاف زمان‌بندی نشده هستند را بر اساس تلاش‌های قبلی زمان‌بندی فیلتر کند.