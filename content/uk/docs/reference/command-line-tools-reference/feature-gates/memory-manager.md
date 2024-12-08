---
title: MemoryManager
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: beta
    defaultValue: true
    fromVersion: "1.22"
---
Дозволяє встановити спорідненість памʼяті для контейнера на основі топології NUMA.
