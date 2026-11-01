---
title: UnlockWhileProcessingFIFO
content_type: feature_gate

build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---

Вмикає використання черги FIFO всередині client-go, яка розблокується під час обробки подій. Якщо не ввімкнено, черга утримує блокування протягом усього часу обробки подій, що може призвести до проблем з продуктивністю у сценаріях з високою пропускною здатністю. Цю функціональну можливість можна перемикати в kube-controller-manager та будь-якому контролері на основі client-go.

Ви можете ввімкнути цю функціональну можливість лише якщо функціональна можливість [AtomicFIFO](/docs/reference/command-line-tools-reference/feature-gates/#AtomicFIFO) також увімкнена.
