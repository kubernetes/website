---
title: WatchList
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.27"
---

<!--
Enable support for [streaming initial state of objects in watch requests](/docs/reference/using-api/api-concepts/#streaming-lists).
-->
启用对[监听请求中流式传输对象初始状态](/zh-cn/docs/reference/using-api/api-concepts/#streaming-lists)的支持。
