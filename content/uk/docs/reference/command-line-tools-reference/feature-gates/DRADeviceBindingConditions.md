---
title: DRADeviceBindingConditions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
---

Дозволяє підтримку DeviceBindingConditions у полях, повʼязаних з DRA. Це дозволяє проводити ретельні перевірки готовності пристроїв та процеси підключення перед фазою привʼязки.
