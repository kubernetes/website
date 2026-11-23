---
title: DRADeviceBindingConditions
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---

Дозволяє підтримку DeviceBindingConditions у полях, повʼязаних з DRA. Це дозволяє проводити ретельні перевірки готовності пристроїв та процеси підключення перед фазою привʼязки.
