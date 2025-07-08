---
title: StreamingCollectionEncodingToProtobuf
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: true
    fromVersion: "1.33"
---

<!--
Allow the API server Protobuf encoder to encode collections item by item, instead of all at once.
-->
允许 API 服务器的 Protobuf 编码器逐项对多个集合进行编码，而不是一次性全部编码。
