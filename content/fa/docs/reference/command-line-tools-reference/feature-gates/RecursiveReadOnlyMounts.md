---
title: RecursiveReadOnlyMounts
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
پشتیبانی از mountهای فقط خواندنی بازگشتی را فعال می‌کند. برای جزئیات بیشتر، به [read-only mounts](/docs/concepts/storage/volumes/#read-only-mounts).مراجعه کنید.
