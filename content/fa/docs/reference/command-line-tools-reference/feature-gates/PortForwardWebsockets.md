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
اجازه دهید WebSocket، زیرپروتکل portforward (`port-forward`) را از کلاینت‌هایی که نسخه v2 (`v2.portforward.k8s.io`) زیرپروتکل را درخواست می‌کنند، پخش کند.

