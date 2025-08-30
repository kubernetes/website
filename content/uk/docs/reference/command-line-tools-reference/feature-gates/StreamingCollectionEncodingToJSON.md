---
title: StreamingCollectionEncodingToJSON
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: true
    fromVersion: "1.33"

---
Дозволяє кодеру JSON сервера API кодувати колекції поелементно, а не всі одразу.
