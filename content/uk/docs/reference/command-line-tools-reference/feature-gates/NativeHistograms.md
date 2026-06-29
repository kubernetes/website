---
title: NativeHistograms
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---
Вмикає компоненти Kubernetes для експорту метрик у форматі Prometheus Native Histogram для підвищення ефективності та точності розподілу кошиків. Див. [Нативні гістограми](/docs/reference/instrumentation/native-histograms/) для отримання додаткової інформації.
