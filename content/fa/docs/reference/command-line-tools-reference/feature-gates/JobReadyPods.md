---
title: JobReadyPods
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.23"
  - stage: beta
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.28"
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.30"

removed: true
---
ردیابی تعداد پادهایی که وضعیت `Ready` دارند را فعال می‌کند.
[condition](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions). تعداد پادهای «آماده» در وضعیت [status](/docs/reference/kubernetes-api/workload-resources/job-v1/#JobStatus) یک [Job](/docs/concepts/workloads/controllers/job) ثبت می‌شود.