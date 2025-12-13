---
title: APIServingWithRoutine
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
這個特性門控可以啓用一項 API 伺服器性能提升：API 伺服器可以使用獨立的 Goroutine
（由 Go 運行時管理的輕量級執行緒）來處理
[**watch**](/zh-cn/docs/reference/using-api/api-concepts/#efficient-detection-of-changes) 請求。
