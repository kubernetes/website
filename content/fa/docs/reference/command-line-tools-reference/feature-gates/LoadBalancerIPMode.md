---
title: LoadBalancerIPMode
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
---
تنظیم `ipMode` را برای سرویس‌هایی که `type` آنها روی `LoadBalancer` تنظیم شده است، امکان‌پذیر می‌کند.
برای اطلاعات بیشتر به [Specifying IPMode of load balancer status](/docs/concepts/services-networking/service/#load-balancer-ip-mode) مراجعه کنید.