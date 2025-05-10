---
title: Accelerators
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.6"
    toVersion: "1.10"
  - stage: deprecated
    fromVersion: "1.11"
    toVersion: "1.11"

removed: true
---

Надавав ранню форму втулка для ввімкнення підтримки графічного процесора Nvidia під час використання Docker Engine; більше не доступний. Див. [Втулки пристроїв](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) для альтернатив.
