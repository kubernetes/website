---
title: ConcurrentWatchObjectDecode
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.31"

---

<!--
Enable concurrent watch object decoding. This is to avoid starving the API server's
watch cache when a conversion webhook is installed.
-->
啓用併發監視對象解碼。目的是避免在安裝了轉換 Webhook 時造成 API 伺服器的監視緩存內容不足。
