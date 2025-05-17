---
title: SeparateCacheWatchRPC
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
    toVersion: "1.32"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.33"

---
Дозволяє серверу API створювати спостереження в кеші на відділеному RPC. Це запобігає голодуванню кешу спостереження іншими спостереженнями.
