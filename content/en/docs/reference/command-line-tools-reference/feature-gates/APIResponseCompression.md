---
title: APIResponseCompression
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    locked: false
    fromVersion: "1.8"
    toVersion: "1.15"
  - stage: beta
    defaultValue: true
    locked: false
    fromVersion: "1.16"
---

Compress the API responses for `LIST` or `GET` requests.
