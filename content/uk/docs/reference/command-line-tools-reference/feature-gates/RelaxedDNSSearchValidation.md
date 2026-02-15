---
title: RelaxedDNSSearchValidation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
    toVersion: "1.33"
  - stage: stable
    locked: true
    defaultValue: true
    fromVersion: "1.34"

---
Послаблює перевірку на стороні сервера рядка пошуку DNS (`.spec.dnsConfig.searches`) для контейнерів. Наприклад, з цією увімкненою можливістю можна включити символ `_` до рядка пошуку імен DNS.
