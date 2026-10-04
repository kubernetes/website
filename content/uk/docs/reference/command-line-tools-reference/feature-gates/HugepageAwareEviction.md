---
title: HugepageAwareEviction
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
Віднімає обсяг hugepage від `memory.available`, щоб сигнал витіснення від kubelet відображав фактичну доступність звичайної пам’яті. Без цього обмеження резервування hugepage завищує значення `AvailableBytes`, що затримує витіснення та призводить до завершення процесів через нестачу пам’яті (OOM) на вузлах, де налаштовані hugepage.
