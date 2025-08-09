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

Дозволити WebSocket потік підпротоколу віддалених команд (`exec`, `cp`, `attach`) від клієнтів, які запитують версію 5 (v5) підпротоколу.
