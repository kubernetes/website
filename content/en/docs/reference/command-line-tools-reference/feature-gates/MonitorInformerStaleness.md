---
title: MonitorInformerStaleness
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: false
    fromVersion: "1.35"
---

Enable metrics to watch for staleness of the KCM informer cache.