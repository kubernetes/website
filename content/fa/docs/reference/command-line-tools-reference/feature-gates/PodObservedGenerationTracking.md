---
title: PodObservedGenerationTracking
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---
به kubelet این امکان را می‌دهد که `observedGeneration` را در وضعیت pod تنظیم کند و به سایر کامپوننت‌ها این امکان را می‌دهد که `observedGeneration` را در شرایط pod تنظیم کنند تا `metadata.generation` مربوط به pod را در زمانی که وضعیت یا وضعیت در حال ثبت است، منعکس کند.