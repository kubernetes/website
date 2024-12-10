---
title: DRAControlPlaneController
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.26"
---
Дозволяє підтримувати ресурси з власними параметрами та життєвим циклом, який не залежить від Pod. Розподілом ресурсів займається контролер панелі управління драйвера ресурсу.
