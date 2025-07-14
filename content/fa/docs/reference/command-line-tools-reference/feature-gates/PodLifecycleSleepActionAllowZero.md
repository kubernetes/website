---
title: PodLifecycleSleepActionAllowZero
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---
تنظیم مقدار صفر برای عمل `sleep` را در [container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/) فعال می‌کند.