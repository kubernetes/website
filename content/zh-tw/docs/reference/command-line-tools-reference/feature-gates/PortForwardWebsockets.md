---
title: PortForwardWebsockets
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
---

<!--
Allow WebSocket streaming of the
portforward sub-protocol (`port-forward`) from clients requesting
version v2 (`v2.portforward.k8s.io`) of the sub-protocol.
-->
允許從請求 v2 子協議（`v2.portforward.k8s.io`）的客戶端通過 portforward 子協議
（`port-forward`）執行 WebSocket 流式傳輸。
