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
Allow WebSocket streaming of the
remote command sub-protocol (`exec`, `cp`, `attach`) from clients requesting
version 5 (v5) of the sub-protocol.
