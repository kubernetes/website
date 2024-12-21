---
title: KubeletCrashLoopBackOffMax
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---

Дозволяє підтримувати конфігуровані максимальні значення backoff для кожного вузла для перезапуску контейнерів у стані CrashLoopBackOff.
