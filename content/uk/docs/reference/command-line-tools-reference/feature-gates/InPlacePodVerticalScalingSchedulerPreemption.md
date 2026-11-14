---
title: InPlacePodVerticalScalingSchedulerPreemption
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Вмикає витіснення планувальником подів з нижчим пріоритетом для виконання відкладених запитів на зміну розміру подів на місці.
