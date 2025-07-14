---
title: MaxUnavailableStatefulSet
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.24"
---
تنظیم فیلد `maxUnavailable` را برای [rolling update strategy](/docs/concepts/workloads/controllers/statefulset/#rolling-updates) از یک StatefulSet فعال می‌کند. این فیلد حداکثر تعداد Podهایی را که می‌توانند در طول به‌روزرسانی در دسترس نباشند، مشخص می‌کند.