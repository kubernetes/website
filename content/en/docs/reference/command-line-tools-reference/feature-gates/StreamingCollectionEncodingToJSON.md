---
title: StreamingCollectionEncodingToJSON
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
    toVersion: "1.33"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.34"
---
Allow the API server JSON encoder to encode collections item by item, instead of all at once.
