---
title: CBORServingAndStorage
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---

Вмикає CBOR як [підтримуване кодування для запитів і відповідей](/docs/reference/using-api/api-concepts/#cbor-encoding), а також як бажане кодування сховища для власних ресурсів користувача.
