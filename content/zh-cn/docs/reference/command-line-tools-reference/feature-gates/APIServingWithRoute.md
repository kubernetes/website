---
title: APIServingWithRoute
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.30"
---

<!--
This feature gate enables an API server performance improvement:
the API server can use separate goroutines (lightweight threads managed by the Go runtime)
to serve [**watch**](/docs/reference/using-api/api-concepts/#efficient-detection-of-changes)
requests.
-->
这个特性门控可以启用一项 API 服务器性能提升：API 服务器可以使用独立的 Goroutine
（由 Go 运行时管理的轻量级线程）来处理
[**watch**](/zh-cn/docs/reference/using-api/api-concepts/#efficient-detection-of-changes) 请求。
