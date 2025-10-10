---
title: JobPodReplacementPolicy
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
---
به شما امکان می‌دهد جایگزینی پاد را برای پادهای خاتمه‌دهنده در یک [Job](/docs/concepts/workloads/controllers/job) مشخص کنید.