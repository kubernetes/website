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
Дозволяє кодеру API сервера Protobuf кодувати колекції поелементно, а не всі одразу.
