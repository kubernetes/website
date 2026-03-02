---
title: ReduceDefaultCrashLoopBackOffDecay
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---
Дозволяє зменшити як початкову затримку, так і максимальну затримку, що накопичується між перезапусками контейнерів для вузла для контейнерів у `CrashLoopBackOff` по всьому кластеру до `1s` початкової затримки та `60s` максимальної затримки.
