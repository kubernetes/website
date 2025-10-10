---
title: SchedulerPopFromBackoffQ
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---

با حذف پادها از backoffQ در زمانی که activeQ خالی است، رفتار صف‌بندی را بهبود می‌بخشد.
این امر امکان پردازش پادهای بالقوه قابل برنامه‌ریزی را در اسرع وقت فراهم می‌کند و اثر جریمه صف backoff را از بین می‌برد.
