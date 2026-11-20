---
title: WatchListClientConcurrentDecoding
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.38"
---
Enables `client-go` to decode objects concurrently in
[WatchList responses](/docs/reference/using-api/api-concepts/#streaming-lists)
while preserving event order.
