---
title: MultiCIDRServiceAllocator
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.30"
  - stage: beta
    defaultValue: false
    fromVersion: "1.31"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.33"
---
تخصیص آدرس IP را برای IP های خوشه سرویس با استفاده از اشیاء IPAddress پیگیری کنید.
