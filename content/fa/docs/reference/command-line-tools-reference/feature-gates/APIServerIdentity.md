---
title: APIServerIdentity
content_type: feature_gate
_build:
  list: never

  render: false

stages:
  - stage: alpgha
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.25"
  - stage: beta
    defaultValue: true
    fromVersion: "1.26"  
---
با استفاده از یک [Lease](/docs/concepts/architecture/leases)، به هر سرور API در یک کلاستر یک شناسه اختصاص دهید.
