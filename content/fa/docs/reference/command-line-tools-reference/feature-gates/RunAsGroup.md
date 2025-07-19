---
# Removed from Kubernetes
title: RunAsGroup
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.14"
    toVersion: "1.20"
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"

removed: true
---
کنترل بر روی شناسه گروه اصلی تنظیم‌شده روی فرآیندهای آغازین کانتینرها را فعال کنید.
