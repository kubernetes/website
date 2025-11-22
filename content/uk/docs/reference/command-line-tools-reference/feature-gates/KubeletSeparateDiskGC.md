---
title: KubeletSeparateDiskGC
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
---
Функція розділеної файлової системи образів дозволяє kubelet виконувати збір сміття образів (шарів лише для читання) та/або контейнерів (шарів для запису), розгорнутих на окремих файлових системах.
