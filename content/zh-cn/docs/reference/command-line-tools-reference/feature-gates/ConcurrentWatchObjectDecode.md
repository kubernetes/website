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
启用并发监视对象解码。目的是避免在安装了转换 Webhook 时造成 API 服务器的监视缓存内容不足。
