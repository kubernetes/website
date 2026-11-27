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
Дозволяє кешу спостереження API-сервера створювати спостереження на виділеному RPC. Це запобігає голодуванню кешу спостереження іншими спостереженнями.
