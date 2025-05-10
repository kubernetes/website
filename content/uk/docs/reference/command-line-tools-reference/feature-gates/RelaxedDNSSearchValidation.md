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
---
Послаблює перевірку на стороні сервера рядка пошуку DNS (`.spec.dnsConfig.searches`) для контейнерів. Наприклад, з цією увімкненою можливістю можна включити символ `_` до рядка пошуку імен DNS.
