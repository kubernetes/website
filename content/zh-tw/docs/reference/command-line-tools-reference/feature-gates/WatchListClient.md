---
title: WatchListClient
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.30"
---

<!--
Allows an API client to request a stream of data rather than fetching a full list. 
This functionality is available in `client-go` and requires the 
[WatchList](/docs/reference/command-line-tools-reference/feature-gates/) 
feature to be enabled on the server. 
If the `WatchList` is not supported on the server, the client will seamlessly fall back to a standard list request.
-->
允許 API 客戶端請求資料流，而不是獲取完整的列表。
此功能可以在 `client-go` 中使用，需要在伺服器上啓用
[WatchList](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
特性。如果伺服器不支持 `WatchList`，客戶端將自動回退爲標準的 list 請求。
