---
title: SeparateCacheWatchRPC
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.20"
---
Дозволяє серверу API створювати спостереження в кеші на відділеному RPC. Це запобігає голодуванню кешу спостереження іншими спостереженнями.
