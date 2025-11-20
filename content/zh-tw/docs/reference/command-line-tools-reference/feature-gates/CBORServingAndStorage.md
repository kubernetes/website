---
title: CBORServingAndStorage
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---

<!--
Enables CBOR as a [supported encoding for requests and
responses](/docs/reference/using-api/api-concepts/#cbor-encoding), and as the preferred storage
encoding for custom resources.
-->
允許將 CBOR 用作[請求和響應所支持的編碼方式](/zh-cn/docs/reference/using-api/api-concepts/#cbor-encoding)，
同時允許將 CBOR 用作定製資源的首選儲存編碼方式。
