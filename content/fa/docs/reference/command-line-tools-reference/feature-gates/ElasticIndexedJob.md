---
title: ElasticIndexedJob
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
---
با تغییر هر دو `spec.completions` و `spec.parallelism` به یکدیگر به طوری که `spec.completions == spec.parallelism` شود، امکان افزایش یا کاهش مقیاس کارهای فهرست‌بندی شده را فراهم می‌کند.
برای جزئیات بیشتر به اسناد [elastic Indexed Jobs](/docs/concepts/workloads/controllers/job#elastic-indexed-jobs) مراجعه کنید.