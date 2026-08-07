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
[WatchList](/docs/reference/command-line-tools-reference/feature-gates/WatchList/)
responses from the API server.
