---
title: NativeHistograms
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.36"
    toVersion: "1.36"
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
Дозволяє компонентам Kubernetes експортувати метрики у форматі Prometheus Native Histogram для підвищення ефективності та точності розподілу кошиків. Див. [Нативні гістограми](/docs/reference/instrumentation/native-histograms/) для отримання додаткової інформації.
