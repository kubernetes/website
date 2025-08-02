---
title: PodLevelResources
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---

Вмикає _Pod level resources_: можливість визначати запити та ліміти ресурсів на рівні Podʼа, а не лише для контейнерів.
