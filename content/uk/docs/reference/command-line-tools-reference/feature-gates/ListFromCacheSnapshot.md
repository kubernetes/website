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

---
Дозволяє серверу API створювати знімки для сховища кешу спостереження і використовувати їх для обслуговування LIST-запитів.
