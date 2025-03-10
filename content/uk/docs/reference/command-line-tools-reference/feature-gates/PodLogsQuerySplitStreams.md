---
title: PodLogsQuerySplitStreams
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---

Дозволяє отримувати конкретні потоки логів (або stdout, або stderr) з потоків логів контейнера, використовуючи API Pod.
