---
title: QOSReserved
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.11"
---

<!--
Allows resource reservations at the QoS level preventing pods
at lower QoS levels from bursting into resources requested at higher QoS levels
(memory only for now).
-->
允許在 QoS 層面預留資源，避免低 QoS 級別的 Pod 佔用高 QoS 級別所請求的資源（當前只適用於內存）。
