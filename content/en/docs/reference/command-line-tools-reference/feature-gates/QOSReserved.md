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
Allows resource reservations at the QoS level preventing pods
at lower QoS levels from bursting into resources requested at higher QoS levels
(memory only for now).
