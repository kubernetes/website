---
title: ListFromCacheSnapshot
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"

---
Дозволяє серверу API створювати знімки для сховища кешу спостереження і використовувати їх для обслуговування LIST-запитів.
