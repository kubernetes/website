---
title: SeparateTaintEvictionController
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
---
Дозволяє запуск `TaintEvictionController`, який виконує [Taint-based Evictions](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions), у контролері, відокремленому від `NodeLifecycleController`. Коли цю можливість увімкнено, користувачі можуть за бажанням вимкнути виселення на основі Taint, встановивши прапорець `--controllers=-taint-eviction-controller` у `kube-controller-manager`.
