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
允许在 QoS 层面预留资源，避免低 QoS 级别的 Pod 占用高 QoS 级别所请求的资源（当前只适用于内存）。