---
title: BtreeWatchCache
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.33"

---
Якщо увімкнено, сервер API замінить застарілий _watch cache_ на основі HashMap на реалізацію на основі BTree. Ця заміна може призвести до покращення продуктивності.
