---
title: TranslateStreamCloseWebsocketRequests
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.29"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
---
اجازه دهید WebSocket زیرپروتکل فرمان از راه دور (`exec`، `cp`، `attach`) را از کلاینت‌هایی که نسخه 5 (v5) زیرپروتکل را درخواست می‌کنند، پخش کند.
