---
title: AllowParsingUserUIDFromCertAuth
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"

---
Коли цю функцію увімкнено, атрибут імені субʼєкта `1.3.6.1.4.1.57683.2` у сертифікаті X.509 буде оброблятися як UID користувача під час автентифікації сертифіката.
