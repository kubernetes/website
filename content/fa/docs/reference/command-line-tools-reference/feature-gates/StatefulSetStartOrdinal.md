---
title: StatefulSetStartOrdinal
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
---
پیکربندی عدد ترتیبی شروع را در یک StatefulSet مجاز کنید. برای جزئیات بیشتر به [Start ordinal](/docs/concepts/workloads/controllers/statefulset/#start-ordinal) مراجعه کنید.
