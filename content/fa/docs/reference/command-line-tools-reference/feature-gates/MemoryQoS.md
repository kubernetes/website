---
title: MemoryQoS
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.22"
---
فعال کردن محافظت از حافظه و کنترل مصرف در پاد/کانتینر با استفاده از کنترلر حافظه cgroup v2.
