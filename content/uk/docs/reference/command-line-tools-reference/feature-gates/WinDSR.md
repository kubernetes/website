---
title: WinDSR
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.14"
---
Дозволяє `kube-proxy` створювати DSR-балансувальники навантаження для Windows.
