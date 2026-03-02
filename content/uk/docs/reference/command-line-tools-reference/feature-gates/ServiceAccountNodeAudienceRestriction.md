---
title: ServiceAccountNodeAudienceRestriction
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"

---
Ця функціональна можливість використовується для обмеження аудиторії, для якої kubelet може запитувати токен службового облікового запису.
