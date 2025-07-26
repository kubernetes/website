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
Дозволяє кодеру API сервера Protobuf кодувати колекції поелементно, а не всі одразу.
