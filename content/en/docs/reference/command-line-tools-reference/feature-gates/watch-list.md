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
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
---
Enable support for [streaming initial state of objects in watch requests](/content/en/docs/reference/using-api/api-concepts.md/#streaming-lists).
