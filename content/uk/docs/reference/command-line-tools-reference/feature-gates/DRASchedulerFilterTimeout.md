---
title: DRASchedulerFilterTimeout
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"

---
Дозволяє припинити роботу фільтра для кожного вузла в планувальнику через певний час ( стандартно 10 секунд, можна налаштувати в конфігурації втулка DynamicResources).
