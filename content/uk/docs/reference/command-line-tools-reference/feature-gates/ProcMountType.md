---
title: ProcMountType
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.12"
    toVersion: "1.30"
  - stage: beta
    defaultValue: false
    fromVersion: "1.31"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"

---
Дозволяє керувати типом монтування proc для контейнерів, встановлюючи поле `procMount` Podʼа у `securityContext`.
