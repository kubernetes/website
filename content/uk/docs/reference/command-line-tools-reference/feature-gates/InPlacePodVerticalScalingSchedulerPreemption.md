---
title: InPlacePodVerticalScalingSchedulerPreemption
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Вмикає витіснення планувальником Podʼів з нижчим пріоритетом для виконання відкладених запитів на зміну розміру Podʼів на місці.
