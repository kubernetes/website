---
title: UnknownVersionInteroperabilityProxy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.28"
---
درخواست‌های منابع پروکسی به سرور kube-apiser صحیح، زمانی که چندین سرور kube-apiser با نسخه‌های مختلف وجود دارد. برای اطلاعات بیشتر به [Mixed version proxy](/docs/concepts/architecture/mixed-version-proxy/) مراجعه کنید.