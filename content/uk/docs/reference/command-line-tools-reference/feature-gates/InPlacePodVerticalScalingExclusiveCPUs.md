---
title: InPlacePodVerticalScalingExclusiveCPUs
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---
Вмикає зміну розміру ресурсу для контейнерів у Guaranteed podʼах з цілочисельними запитами на CPU. Застосовується лише у вузлах з увімкненими функціями `InPlacePodVerticalScaling` та `CPUManager`, а політика CPUManager має значення `static`.
