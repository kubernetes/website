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
---

<!--
Allow WebSocket streaming of the
portforward sub-protocol (`port-forward`) from clients requesting
version v2 (`v2.portforward.k8s.io`) of the sub-protocol.
-->
允许从请求 v2 子协议（`v2.portforward.k8s.io`）的客户端通过 portforward 子协议
（`port-forward`）执行 WebSocket 流式传输。
