---
title: WatchListCompression
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
Enables compression for
[_watch list_](/docs/reference/using-api/api-concepts/#streaming-lists)
responses from the API server.
This feature gate has no effect if `WatchList` is disabled.
