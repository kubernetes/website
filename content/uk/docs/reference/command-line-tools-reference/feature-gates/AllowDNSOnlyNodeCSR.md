---
title: AllowDNSOnlyNodeCSR
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.31"
---
Дозволяє kubelet запитувати сертифікат без будь-якого доступного Node IP, лише з DNS-іменами.
