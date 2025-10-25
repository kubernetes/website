---
title: ServiceAccountTokenJTI
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.29"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
---

Контролює, чи вбудовуються JTI (UUID) у згенеровані токени службових облікових записів, і чи записуються ці JTI до логу аудиту Kubernetes для майбутніх запитів, зроблених цими токенами.
