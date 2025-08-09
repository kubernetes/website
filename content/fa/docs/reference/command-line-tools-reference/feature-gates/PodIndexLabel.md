---
title: PodIndexLabel
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
---
کنترلر Job و کنترلر StatefulSet را قادر می‌سازد تا هنگام ایجاد podهای جدید، شاخص pod را به عنوان یک برچسب اضافه کنند. برای جزئیات بیشتر به [Job completion mode docs](/docs/concepts/workloads/controllers/job#completion-mode) و [StatefulSet pod index label docs](/docs/concepts/workloads/controllers/statefulset/#pod-index-label) مراجعه کنید.