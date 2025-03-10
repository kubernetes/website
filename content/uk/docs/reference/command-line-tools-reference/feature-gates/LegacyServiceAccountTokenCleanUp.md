---
title: LegacyServiceAccountTokenCleanUp
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.29"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"

removed: true
---

Вмикає очищення [токенів службових облікових записів](/docs/concepts/security/service-accounts/#get-a-token), що базуються на Secret, коли вони не використовуються протягом певного часу (стандартно — один рік).
