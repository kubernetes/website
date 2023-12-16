---
title: QOSReserved
content_type: feature_gate
_build:
  list: never
  render: false
---
Allows resource reservations at the QoS level preventing pods
at lower QoS levels from bursting into resources requested at higher QoS levels
(memory only for now).
