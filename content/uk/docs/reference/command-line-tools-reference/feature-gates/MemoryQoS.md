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
Вмикає захист памʼяті та обмеження використання памʼяті на pod/контейнер за допомогою контролера памʼяті cgroup v2.
