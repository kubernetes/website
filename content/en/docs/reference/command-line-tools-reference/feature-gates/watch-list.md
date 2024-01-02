---
title: WatchList
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.27"
---
Enable support for [streaming initial state of objects in watch requests](/docs/reference/using-api/api-concepts/#streaming-lists).
