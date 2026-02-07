---
title: InPlacePodVerticalScalingAllocatedStatus
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.33"

---
Вмикає поле `allocatedResources` у статусі контейнера. Ця функція вимагає, щоб також було увімкнено можливість `InPlacePodVerticalScaling`.
