---
title: ConcurrentWatchObjectDecode
content_type: feature_gate

build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.31"

---
Enable concurrent watch object decoding. This is to avoid starving the API server's
watch cache when a conversion webhook is installed.
