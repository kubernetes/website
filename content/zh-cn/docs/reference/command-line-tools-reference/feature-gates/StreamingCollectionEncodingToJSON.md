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
    locked: true
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Allow the API server JSON encoder to encode collections item by item, instead of all at once.
-->
允许 API 服务器的 JSON 编码器逐项对多个集合进行编码，而不是一次性全部编码。
