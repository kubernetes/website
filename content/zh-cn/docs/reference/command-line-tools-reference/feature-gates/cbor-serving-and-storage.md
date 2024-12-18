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
允许将 CBOR 用作[请求和响应所支持的编码方式](/zh-cn/docs/reference/using-api/api-concepts/#cbor-encoding)，
同时允许将 CBOR 用作定制资源的首选存储编码方式。
