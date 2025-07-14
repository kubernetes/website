---
title: ServiceTrafficDistribution
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.33"

---
امکان استفاده از فیلد اختیاری `spec.trafficDistribution` در سرویس‌ها را فراهم می‌کند. این فیلد روشی برای بیان ترجیحات نحوه توزیع ترافیک به نقاط پایانی سرویس ارائه می‌دهد.
