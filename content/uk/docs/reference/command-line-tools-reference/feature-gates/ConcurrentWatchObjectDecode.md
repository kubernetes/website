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

Вмикає одночасне декодування обʼєктів watch. Це потрібно для того, щоб уникнути голодування кешу watch API-сервера, коли встановлений вебхук перетворення.
