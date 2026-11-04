---
title: HugepageAwareEviction
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
Віднімає обсяг hugepage від `memory.available`, щоб сигнал витіснення від kubelet відображав фактичну доступність звичайної памʼяті. Без цієї функціональної можливості резервування hugepage завищує значення `AvailableBytes`, що затримує витіснення та призводить до завершення процесів через нестачу памʼяті (OOM) на вузлах, де налаштовані hugepage.
