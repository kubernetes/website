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
    toVersion: "1.33"
  - stage: stable
    locked: true
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Allow the API server Protobuf encoder to encode collections item by item, instead of all at once.
-->
允許 API 服務器的 Protobuf 編碼器逐項對多個集合進行編碼，而不是一次性全部編碼。
